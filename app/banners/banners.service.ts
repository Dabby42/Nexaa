import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Banner } from "./entities/banner.entity";
import { Repository } from "typeorm";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { RoleEnum } from "app/user/entities/user.entity";

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private bannerRepository: Repository<Banner>) {}

  async createBanner(role: number, createBannerDto: CreateBannerDto) {
    if (role === RoleEnum.ADMIN) {
      try {
        const banner_urls_and_sizes = JSON.stringify(createBannerDto.banner_images_and_sizes);
        const newBanner = { ...createBannerDto, banner_images_and_sizes: banner_urls_and_sizes };
        const banner = this.bannerRepository.create(newBanner);

        const data = await this.bannerRepository.save(banner);
        return sendSuccess(data, "Banner Created");
      } catch (error) {
        throw new UnprocessableEntityException("An unknown error occurred");
      }
    } else {
      throw new UnauthorizedException("You are not authorized");
    }
  }
}
