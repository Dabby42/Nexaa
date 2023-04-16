import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { LinksService } from "./links.service";
import { CreateCustomUrlDto } from "./dto/create-custom-url.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";

@ApiBearerAuth("jwt")
@ApiTags("Links")
@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtGuard)
  @Post("generate-custom-url")
  async generateCustomUrl(@Body() createCustomUrlDto: CreateCustomUrlDto, @Req() req: Request) {
    const result = await this.linksService.generateCustomUrl(createCustomUrlDto, req);
    return sendSuccess(result, "Custom link generated successfully");
  }

  async recordClicks(k_id: string, @Req() req: Request) {
    await this.linksService.recordClicks(k_id, req);
    return sendSuccess(null, "Click recorded successfully");
  }
}
