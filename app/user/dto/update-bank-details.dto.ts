import { IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateBankDetailsDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly account_number: string;
}
