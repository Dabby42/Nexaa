import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateCustomUrlDto {
  @IsNotEmpty()
  @IsUrl(
    { host_whitelist: ["konga.com", "www.konga.com"] },
    {
      message: "Only konga.com links are accepted",
    }
  )
  readonly redirect_url: string;

  @IsOptional()
  readonly is_default?: boolean;
}
