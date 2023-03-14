import { IsInt, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class BannerSearchDto {
  @IsNotEmpty()
  name?: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  limit = 20;
}
