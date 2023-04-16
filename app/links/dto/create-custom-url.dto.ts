import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateCustomUrlDto {
  @IsNotEmpty()
  @IsUrl(
    { host_whitelist: ["konga.com"] },
    {
      message: "Invalid URL",
      // replace example.com with your allowed domain
    }
  )
  readonly redirect_url: string;
}
