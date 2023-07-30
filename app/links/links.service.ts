import { BadRequestException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateCustomUrlDto } from "./dto/create-custom-url.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Links } from "./entities/link.entity";
import { DeepPartial } from "typeorm";
import { randomUUID } from "crypto";
import { config } from "../config/config";
import { Clicks } from "./entities/click.entity";
import { Ips } from "./entities/ip.entity";
import { RabbitmqService } from "../rabbitmq/rabbitmq.service";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Links) private linkRepository: Repository<Links>,
    @InjectRepository(Clicks) private clickRepository: Repository<Clicks>,
    @InjectRepository(Ips) private ipRepository: Repository<Ips>,
    private cacheService: CacheService,
    private rabbitMQService: RabbitmqService
  ) {}

  async generateCustomUrl(createCustomUrlDto: CreateCustomUrlDto, req) {
    const { redirect_url, is_default = false } = createCustomUrlDto;
    const userId: number = req.user.id;
    const uuid = randomUUID();
    const existingLink = await this.linkRepository.findOne({ where: { redirect_url, user_id: { id: userId } } });
    if (existingLink) {
      return {
        custom_url: `${config.baseUrl}/v1/${existingLink.k_id}`,
      };
    }
    const newLink: DeepPartial<Links> = { redirect_url, user_id: { id: userId }, k_id: uuid, is_default };

    const newLinkEntityInstance = this.linkRepository.create(newLink);

    try {
      await this.linkRepository.save(newLinkEntityInstance);

      return {
        custom_url: `${config.baseUrl}/${uuid}`,
      };
    } catch (e) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async recordClicks(k_id: string, req) {
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const cacheKey = "link_" + k_id;
    let data = await this.cacheService.get(cacheKey);
    if (!data) {
      const foundLinkModel = await this.linkRepository.findOne({ where: { k_id }, relations: ["user_id"] });
      if (!foundLinkModel) {
        throw new BadRequestException();
      }
      data = { id: foundLinkModel.id, username: foundLinkModel.user_id.username, redirect_url: foundLinkModel.redirect_url };
      await this.cacheService.set(cacheKey, data, 60 * 60);
    }

    const publishData = { link_id: data.id, ip_address: ipAddress };
    this.rabbitMQService.publishClickMessage(publishData);
    return data.redirect_url + "?k_id=" + data.username;
  }

  async registerClick(message) {
    const ipAddress = message.ip_address;
    const findOptions: FindOneOptions<Ips> = { relations: ["link_id"], where: { ip_address: ipAddress, link_id: { id: message.link_id } } };
    const foundIpAddress = await this.ipRepository.findOne(findOptions);

    if (foundIpAddress) {
      const clickFindOptions: FindOptionsWhere<Clicks> = { link_id: { id: foundIpAddress.link_id.id } };
      const click = await this.clickRepository.findBy(clickFindOptions);
      let existingClickCount = click[0].count;

      const now = new Date();
      const isSameDate =
        click[0].created_at.getFullYear() === now.getFullYear() && click[0].created_at.getMonth() === now.getMonth() && click[0].created_at.getDate() === now.getDate();

      if (isSameDate) {
        existingClickCount++;
        await this.clickRepository.update(
          { link_id: { id: foundIpAddress.link_id.id } },
          {
            count: existingClickCount,
          }
        );
      } else {
        const newClickDetails = {
          link_id: { id: message.link_id },
          unique_count: 1,
          count: 1,
        };
        const newClickInstance = this.clickRepository.create(newClickDetails);
        await this.clickRepository.insert(newClickInstance);
      }
    } else {
      const ipDetails: DeepPartial<Ips> = {
        link_id: { id: message.link_id },
        ip_address: ipAddress,
      };

      const newIpModel = this.ipRepository.create(ipDetails);
      await this.ipRepository.save(newIpModel);

      const click = await this.clickRepository.findOne({ where: { link_id: { id: message.link_id } } });

      if (click) {
        await this.clickRepository.update(
          { link_id: { id: message.link_id } },
          {
            unique_count: click.unique_count + 1,
            count: click.count + 1,
          }
        );
      } else {
        const newClickDetails = {
          link_id: { id: message.link_id },
          unique_count: 1,
          count: 1,
        };
        const newClickModel = this.clickRepository.create(newClickDetails);
        await this.clickRepository.save(newClickModel);
      }
    }
  }

  async getClicksByDays(req, days) {
    const today = new Date();
    const userId: number = req.user.id;
    const links = await this.linkRepository.find({ where: { user_id: { id: userId } } });
    const linkIds = links.map((link) => link.id);
    const date = new Date(today.setDate(today.getDate() - days));
    return await this.clickRepository.createQueryBuilder("click").where("click.created_at >= :date AND click.link_id IN (:...link_ids)", { date, link_ids: linkIds }).getMany();
  }

  async getTotalClicksCount(user_id: number) {
    const result = await this.clickRepository
      .createQueryBuilder("click")
      .leftJoin("click.link_id", "link")
      .select("SUM(click.count)", "clicksCount")
      .addSelect("SUM(click.unique_count)", "uniqueClicksCount")
      .where("link.user_id = :user_id", { user_id })
      .getRawOne();
    if (!result?.clicksCount)
      return {
        clicksCount: "0",
        uniqueClicksCount: "0",
      };
    return result;
  }

  async getTotalClicksForCampaign(campaign_id: number, start_date: string, end_date: string) {
    const query = await this.clickRepository
      .createQueryBuilder("click")
      .leftJoin("click.link_id", "link")
      .select("IFNULL(SUM(click.count), 0)", "clicksCount")
      .addSelect("IFNULL(SUM(click.unique_count), 0)", "uniqueClicksCount")
      .addSelect("IFNULL(SUM(click.count) - SUM(click.unique_count), 0)", "repeatedClicksCount");

    if (campaign_id) {
      query.where("link.banner_id = :campaign_id", { campaign_id });
    } else {
      query.where("link.banner_id IS NOT NULL");
    }

    if (start_date && end_date) {
      query.andWhere("DATE(click.created_at) >= :start_date AND DATE(click.created_at) <= :end_date", {
        start_date,
        end_date,
      });
    }

    return query.getRawOne();
  }
}
