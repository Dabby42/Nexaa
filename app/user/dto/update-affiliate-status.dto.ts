import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateAffiliateStatusDto {
  @IsNotEmpty()
  @IsInt()
  readonly affiliate_id: number;

  @IsNotEmpty()
  @IsOptional()
  readonly reason?: string;
}
