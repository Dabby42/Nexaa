import { Controller, Post, Body, Req, UseGuards, Query, Get } from "@nestjs/common";
import { LinksService } from "./links.service";
import { CreateCustomUrlDto } from "./dto/create-custom-url.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { AdminGuard } from "../admin/admin.guard";

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

  @UseGuards(JwtGuard)
  @Get("click-by-days")
  async getClicksByDays(@Req() req: Request, @Query("days") days = 7) {
    const result = await this.linksService.getClicksByDays(req, days);
    return sendSuccess(result, "Clicks retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Get("total-clicks-count")
  async getTotalClicksCount(@Req() req) {
    const result = await this.linksService.getTotalClicksCount(req.user.id);
    return sendSuccess(result, "Total clicks count retrieved successfully.");
  }
}
