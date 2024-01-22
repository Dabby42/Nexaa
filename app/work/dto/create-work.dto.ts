import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateWorkDto {
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  readonly url: string;
}
