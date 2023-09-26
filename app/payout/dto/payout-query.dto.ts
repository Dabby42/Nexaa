import { IsDateString, IsNumberString, IsOptional } from "class-validator";

export class PayoutQueryDto {
  @IsOptional()
  @IsNumberString()
  readonly page?: string = "1";

  @IsOptional()
  @IsNumberString()
  readonly limit?: string = "20";

  @IsDateString()
  @IsOptional()
  readonly start_date?: string;

  @IsDateString()
  @IsOptional()
  readonly end_date?: string;
}
