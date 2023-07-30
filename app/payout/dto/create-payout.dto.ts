import { IsNotEmpty } from "class-validator";

export class CreatePayoutDto {
  @IsNotEmpty()
  order_id: number;

  @IsNotEmpty()
  affiliate_id: number;
}
