import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Banner, BannerStatusEnum } from "./entities/banner.entity";
import { Repository } from "typeorm";
import { sendSuccess } from "app/utils/helpers/response.helpers";

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private bannerRepository: Repository<Banner>) {}

  async createBanner(createBannerDto: CreateBannerDto) {
    try {
      const banner_urls_and_sizes = JSON.stringify(createBannerDto.banner_images_and_sizes);
      const newBanner = { ...createBannerDto, banner_images_and_sizes: banner_urls_and_sizes };
      const banner = this.bannerRepository.create(newBanner);

      const data = await this.bannerRepository.save(banner);
      return sendSuccess(data, "Banner Created");
    } catch (error) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async loadBanners(page: number, limit: number) {
    const [banners, count] = await this.bannerRepository.findAndCount({
      where: { status: BannerStatusEnum.ACTIVE },
      order: { created_at: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pages = Math.ceil(count / limit);

    return {
      banners,
      count,
      current_page: page,
      pages,
    };
  }
}
