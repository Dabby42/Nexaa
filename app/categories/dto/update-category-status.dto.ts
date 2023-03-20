import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCategoryStatusDto {
  @IsNotEmpty()
  @IsNumber()
  readonly status: number;
}
