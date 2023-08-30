import { IsOptional } from "class-validator";
import { BannerImagesAndSizes } from "../entities/banner.entity";

export class UpdateBannerDto {
  @IsOptional()
  readonly banner_name?: string;

  @IsOptional()
  readonly banner_images_and_sizes?: Array<BannerImagesAndSizes>;

  @IsOptional()
  readonly banner_link?: string;

  @IsOptional()
  readonly cover_image?: string;

  @IsOptional()
  readonly tracking_tag?: string;

  @IsOptional()
  readonly commission?: number;
}
