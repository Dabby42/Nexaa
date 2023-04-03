import { IsNotEmpty, IsNumber } from "class-validator";
import { CategoryStatusEnum } from "../entities/category.entity";

export class UpdateCategoryStatusDto {
  @IsNotEmpty()
  @IsNumber()
  readonly status: CategoryStatusEnum;
}
