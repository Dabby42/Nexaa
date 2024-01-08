import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  readonly email: string;
}
