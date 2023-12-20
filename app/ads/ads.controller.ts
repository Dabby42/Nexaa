import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, NotFoundException } from "@nestjs/common";
import { AdsService } from "./ads.service";
import { CreateAdDto } from "./dto/create-ad.dto";
import { UpdateAdDto } from "./dto/update-ad.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { AdQueryDto } from "./dto/ad-query.dto";

@ApiBearerAuth("jwt")
@ApiTags("Ads")
@Controller("v1/ads")
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createAd(@Body() createAdDto: CreateAdDto, @Request() req) {
    const data = await this.adsService.createAd(req.user.id, createAdDto);
    return sendSuccess(data, "Ad created successfully.");
  }

  @UseGuards(JwtGuard)
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @Get()
  async getAllAds(@Query() adQueryDto: AdQueryDto) {
    const works = await this.adsService.getAllAds(adQueryDto);
    return sendSuccess(works, "All user ads retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async getAd(@Param("id") id: string) {
    const data = await this.adsService.getAd(+id);
    if (!data) throw new NotFoundException("Ad not found.");
    return sendSuccess(data, "Ad retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async updateAd(@Param("id") id: string, @Body() updateAdDto: UpdateAdDto) {
    await this.adsService.updateAd(+id, updateAdDto);
    return sendSuccess(null, "Ad updated successfully");
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async removeAd(@Param("id") id: string) {
    await this.adsService.removeAd(+id);
    return sendSuccess(null, "Ad deleted successfully.");
  }
}
