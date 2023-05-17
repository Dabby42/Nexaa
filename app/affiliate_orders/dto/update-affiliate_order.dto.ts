import { IsNotEmpty } from "class-validator";

export class UpdateAffiliateOrderDto {
  @IsNotEmpty()
  readonly order_id?: string;

  @IsNotEmpty()
  readonly affiliate_id?: string;
}
