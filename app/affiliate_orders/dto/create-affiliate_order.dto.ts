import { IsNotEmpty } from "class-validator";

export class CreateAffiliateOrderDto {
  @IsNotEmpty()
  readonly order_id: number;

  @IsNotEmpty()
  readonly affiliate_id: number;
}
