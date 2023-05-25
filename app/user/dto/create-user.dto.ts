import { IsAlpha, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

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
  readonly address: string;

  @IsNotEmpty()
  readonly state: string;

  @IsNotEmpty()
  readonly country: string;

  @IsPhoneNumber("NG")
  readonly phone_number: string;

  @IsNotEmpty()
  @IsOptional()
  readonly website_url: string;
}
