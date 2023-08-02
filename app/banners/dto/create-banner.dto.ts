import { ArrayNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { BannerImagesAndSizes } from "../entities/banner.entity";

export class CreateBannerDto {
  @IsNotEmpty()
  readonly banner_name: string;

  @ArrayNotEmpty()
  readonly banner_images_and_sizes: Array<BannerImagesAndSizes>;

  @IsNotEmpty()
  readonly banner_link: string;

  @IsOptional()
  readonly tracking_tag: string;
}
