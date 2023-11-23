import { ArrayNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { BannerImagesAndSizes } from "../entities/banner.entity";

export class CreateBannerDto {
  @IsNotEmpty()
  readonly banner_name: string;

  @IsNotEmpty()
  readonly cover_image: string;

  @ArrayNotEmpty()
  readonly banner_images_and_sizes: Array<BannerImagesAndSizes>;

  @IsNotEmpty()
  readonly banner_link: string;

  @IsNotEmpty()
  readonly banner_description: string;

  @IsNotEmpty()
  readonly campaign_start_date: Date;

  @IsNotEmpty()
  readonly campaign_end_date: Date;

  @IsOptional()
  readonly tracking_tag: string;
}
