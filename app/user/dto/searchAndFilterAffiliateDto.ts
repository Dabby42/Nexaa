import { IsNumberString, IsOptional, MinLength } from "class-validator";

export class SearchAndFilterAffiliateDto {
  @IsOptional()
  @IsNumberString()
  page = "1";

  @IsOptional()
  @IsNumberString()
  limit = "20";

  @IsOptional()
  @MinLength(1)
  q: string;

  @IsOptional()
  @IsNumberString()
  status: string;
}
