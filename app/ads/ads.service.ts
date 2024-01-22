import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdDto } from "./dto/create-ad.dto";
import { UpdateAdDto } from "./dto/update-ad.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CacheService } from "../cache/cache.service";
import { Ad } from "./entities/ad.entity";
import { AdQueryDto } from "./dto/ad-query.dto";

@Injectable()
export class AdsService {
  private readonly cacheKeyBase: string;

  constructor(@InjectRepository(Ad) private adsRepository: Repository<Ad>, private cacheService: CacheService) {
    this.cacheKeyBase = "ADS_";
  }

  async createAd(id: number, createAdDto: CreateAdDto) {
    const newAd = this.adsRepository.create({ ...createAdDto, user_id: { id } });
    return await this.adsRepository.save(newAd);
  }

  async getAllAds(queryAdDto: AdQueryDto) {
    const { page, limit } = queryAdDto;
    return this.cacheService.cachedData(`${this.cacheKeyBase}${page}_${limit}`, async () => {
      const query = this.adsRepository
        .createQueryBuilder("ads")
        .select(["ads.*", "CONCAT(user.first_name, ' ', user.last_name) AS user"])
        .leftJoin("ads.user_id", "user")
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .orderBy("ads.created_at", "DESC");
      const count = await query.getCount();
      const works = await query.getRawMany();

      const pages = Math.ceil(count / +limit);

      return {
        works,
        count,
        current_page: page,
        pages,
      };
    });
  }

  getAd(id: number) {
    let key = this.cacheKeyBase;
    key += id;
    return this.cacheService.cachedData(key, async () => {
      const work = await this.adsRepository.findOne({
        where: { id },
      });

      if (!work) return null;
      return work;
    });
  }

  async updateAd(id: number, updateAdDto: UpdateAdDto) {
    const data = await this.adsRepository.update(id, updateAdDto);
    if (data.affected === 0) throw new BadRequestException("Update could not be performed.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }

  async removeAd(id: number) {
    const data = await this.adsRepository.delete(id);
    if (data.affected === 0) throw new NotFoundException("Ad not found.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }
}
