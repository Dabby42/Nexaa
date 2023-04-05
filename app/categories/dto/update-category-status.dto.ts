import { IsIn, IsNotEmpty } from "class-validator";

type MyType = 1 | 2;

export class UpdateCategoryStatusDto {
  @IsNotEmpty()
  @IsIn([1, 2])
  readonly status: MyType;
}
