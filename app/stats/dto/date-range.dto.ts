import { IsDateString, IsOptional } from "class-validator";

export class DateRangeDto {
  @IsDateString()
  @IsOptional()
  readonly start_date?: string;

  @IsDateString()
  @IsOptional()
  readonly end_date?: string;
}
