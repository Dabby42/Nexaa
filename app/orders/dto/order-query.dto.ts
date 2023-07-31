import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { CommissionPaymentStatusEnum, CommissionStatusEnum } from "../entities/order.entity";

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(CommissionPaymentStatusEnum)
  readonly commission_payment_status?: string;

  @IsOptional()
  @IsEnum(CommissionStatusEnum)
  readonly commission_status?: string;

  @IsOptional()
  @IsNumberString()
  readonly page?: string = "1";

  @IsOptional()
  @IsNumberString()
  readonly limit?: string = "20";

  @IsOptional()
  @IsNumberString()
  affiliate_id?: string;
}
