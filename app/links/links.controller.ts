import { Controller, Post, Body, Req, UseGuards, Query, Get } from "@nestjs/common";
import { LinksService } from "./links.service";
import { CreateCustomUrlDto } from "./dto/create-custom-url.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";

@ApiBearerAuth("jwt")
@ApiTags("Links")
@Controller("v1/links")
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
  @Get("affiliate/campaigns")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @ApiQuery({ name: "filter", type: "string", required: false })
  async getAllCampaigns(@Req() req, @Query("page") page = 1, @Query("limit") limit = 20, @Query("filter") filter?: string) {
    const data = await this.linksService.getAllCampaigns(req.user.id, page, limit, filter);
    return sendSuccess(data, "Campaigns retrieved successfully");
  }
}
