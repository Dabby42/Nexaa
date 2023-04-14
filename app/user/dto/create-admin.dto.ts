import { IsAlpha, IsEmail, IsNotEmpty } from "class-validator";

export class CreateAdminDto {
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
}
