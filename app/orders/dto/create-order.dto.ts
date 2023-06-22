import { IsAlpha, IsNotEmpty, IsNumberString } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  readonly affiliate_id: number;

  @IsNotEmpty()
  readonly product_id: number;

  @IsNotEmpty()
  readonly order_id: string;

  @IsNotEmpty()
  @IsAlpha()
  readonly status: string;

  @IsNotEmpty()
  @IsAlpha()
  readonly category: string;

  @IsNotEmpty()
  readonly return_id: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly commission_payment_status: string;

  @IsNotEmpty()
  readonly commission: number;

  @IsNotEmpty()
  readonly total_amount: number;
}
