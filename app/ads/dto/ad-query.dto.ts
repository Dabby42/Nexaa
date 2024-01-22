import { IsNumberString, IsOptional } from "class-validator";

export class AdQueryDto {
  @IsOptional()
  @IsNumberString()
  readonly page?: string = "1";

  @IsOptional()
  @IsNumberString()
  readonly limit?: string = "20";
}
