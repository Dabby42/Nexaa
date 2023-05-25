import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Banner, BannerStatusEnum } from "./entities/banner.entity";
import { FindOptionsOrder, Like, Repository } from "typeorm";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { BannerSearchDto } from "./dto/banner-search.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

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

  async searchBanners(searchDto: BannerSearchDto) {
    const { search = "", page, limit, filter = "new" } = searchDto;
    let order: FindOptionsOrder<Banner> = { created_at: "DESC" };
    if (filter === "old") order = { created_at: "ASC" };
    const [banners, count] = await this.bannerRepository.findAndCount({
      where: {
        banner_name: Like(`%${search}%`),
        status: BannerStatusEnum.ACTIVE,
      },
      order,
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

  async updateBanner(id: number, updateBannerDto: UpdateBannerDto) {
    try {
      let banner_urls_and_sizes: string;
      let updatedBanner;

      if (updateBannerDto.banner_images_and_sizes) {
        banner_urls_and_sizes = JSON.stringify(updateBannerDto.banner_images_and_sizes);
        updatedBanner = { ...updateBannerDto, banner_images_and_sizes: banner_urls_and_sizes };
      } else {
        updatedBanner = { ...updateBannerDto };
      }

      await this.bannerRepository.update(id, updatedBanner);
      return sendSuccess(null, "Banner Updated");
    } catch (error) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async loadAllBanners(page: number, limit: number) {
    const [banners, count] = await this.bannerRepository.findAndCount({
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
