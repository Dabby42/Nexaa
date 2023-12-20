import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAdDto {
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsOptional()
  readonly amount: number;
}
