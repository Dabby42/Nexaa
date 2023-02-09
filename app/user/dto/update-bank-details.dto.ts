import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateBankDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly account_number: number;
}
