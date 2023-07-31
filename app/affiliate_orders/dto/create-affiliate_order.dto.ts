import { IsNotEmpty } from "class-validator";

export class CreateAffiliateOrderDto {
  @IsNotEmpty()
  readonly order_id: string;

  @IsNotEmpty()
  readonly affiliate_id: string;
}
