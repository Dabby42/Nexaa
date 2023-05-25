import { IsEmail, IsNotEmpty } from "class-validator";

export class ContactUsDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly subject: string;

  @IsNotEmpty()
  readonly description: string;
}
