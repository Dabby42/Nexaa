import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { CountryRegion } from "../../country_region/entities/country_region.entity";

export class CreateUserDto {
  @IsNotEmpty()
  readonly first_name: string;

  @IsNotEmpty()
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
  readonly state: CountryRegion;

  @IsNotEmpty()
  readonly country: string;

  @IsPhoneNumber("NG")
  readonly phone_number: string;

  @IsNotEmpty()
  @IsOptional()
  readonly website_url: string;
}
