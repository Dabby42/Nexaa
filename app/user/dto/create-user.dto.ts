import { IsAlpha, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlpha()
  readonly first_name: string;

  @IsNotEmpty()
  @IsAlpha()
  readonly last_name: string;

  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsOptional()
  readonly city: string;

  @IsNotEmpty()
  readonly country: string;

  @IsNotEmpty()
  @IsOptional()
  readonly account_type: string;

  @IsNotEmpty()
  @IsOptional()
  readonly avatar: string;

  @IsNotEmpty()
  @IsOptional()
  readonly gender: string;
}
