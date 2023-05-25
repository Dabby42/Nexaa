import { IsIn, IsNotEmpty } from "class-validator";

type CategoryStatusType = 1 | 2;

export class UpdateCategoryStatusDto {
  @IsNotEmpty()
  @IsIn([1, 2])
  readonly status: CategoryStatusType;
}
