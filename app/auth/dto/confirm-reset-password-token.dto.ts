import { IsNotEmpty } from "class-validator";

export class ConfirmResetPasswordTokenDto {
  @IsNotEmpty()
  token: string;
}
