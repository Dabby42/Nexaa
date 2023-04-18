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

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Links) private linkRepository: Repository<Links>,
    @InjectRepository(Clicks) private clickRepository: Repository<Clicks>,
    @InjectRepository(Ips) private ipRepository: Repository<Ips>
  ) {}

  async generateCustomUrl(createCustomUrlDto: CreateCustomUrlDto, req) {
    let { redirect_url } = createCustomUrlDto;
    const userId: number = req.user.id;
    const uuid = randomUUID();
    redirect_url = redirect_url + `?k_id=${req.user.username}`;
    const newLink: DeepPartial<Links> = { redirect_url, user_id: { id: userId }, k_id: uuid };

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
    const foundLinkModel = await this.linkRepository.findOne({ where: { k_id } });
    if (!foundLinkModel) {
      throw new BadRequestException();
    }
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const findOptions: FindOneOptions<Ips> = { relations: ["link_id"], where: { ip_address: ipAddress, link_id: { id: foundLinkModel.id } } };
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
          link_id: { id: foundLinkModel.id },
          unique_count: 1,
          count: 1,
        };
        const newClickInstance = this.clickRepository.create(newClickDetails);
        await this.clickRepository.insert(newClickInstance);
      }

      return foundLinkModel.redirect_url;
    } else {
      const ipDetails: DeepPartial<Ips> = {
        link_id: { id: foundLinkModel.id },
        ip_address: ipAddress,
      };

      const newIpModel = this.ipRepository.create(ipDetails);
      await this.ipRepository.save(newIpModel);

      const click = await this.clickRepository.findOne({ where: { link_id: { id: foundLinkModel.id } } });

      if (click) {
        await this.clickRepository.update(
          { link_id: { id: foundLinkModel.id } },
          {
            unique_count: click.unique_count + 1,
            count: click.count + 1,
          }
        );
      } else {
        const newClickDetails = {
          link_id: { id: foundLinkModel.id },
          unique_count: 1,
          count: 1,
        };
        const newClickModel = this.clickRepository.create(newClickDetails);
        await this.clickRepository.save(newClickModel);
      }
      return foundLinkModel.redirect_url;
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
}
