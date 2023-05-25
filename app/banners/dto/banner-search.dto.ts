import { IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class BannerSearchDto {
  @IsString()
  search?: string = "";

  @IsOptional()
  @IsString()
  filter: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  limit = 20;
}
