import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @IsOptional()
  readonly first_name: string;

  @IsNotEmpty()
  @IsOptional()
  readonly last_name: string;

  @IsNotEmpty()
  @IsOptional()
  readonly username: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsOptional()
  readonly city: string;

  @IsNotEmpty()
  @IsOptional()
  readonly country: string;

  @IsNotEmpty()
  @IsOptional()
  readonly account_type: string;

  @IsNotEmpty()
  @IsOptional()
  readonly avatar: string;

  @IsNotEmpty()
  @IsOptional()
  @MinLength(1)
  readonly gender: string;
}
