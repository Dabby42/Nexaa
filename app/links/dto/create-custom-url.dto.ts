import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from "class-validator";
import { ApiHideProperty } from "@nestjs/swagger";
import { config } from "../../config/config";

export class CreateCustomUrlDto {
  @IsOptional()
  @IsNotEmpty()
  @IsUrl(
    { host_whitelist: config.custom_link.allowed_hosts.split(",") },
    {
      message: "Only konga links are accepted",
    }
  )
  readonly redirect_url?: string;

  @IsOptional()
  @IsNumber()
  readonly banner_id?: number;

  @IsOptional()
  @ApiHideProperty()
  readonly is_default?: boolean = false;
}
