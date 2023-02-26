import { Controller, Post, Body, UseGuards, Get, Query } from "@nestjs/common";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AdminGuard } from "app/admin/admin.guard";
import { ApiQuery } from "@nestjs/swagger";

@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    return await this.bannersService.createBanner(createBannerDto);
  }

  @Get()
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getBanners(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.bannersService.loadBanners(page, limit);
    return sendSuccess(data);
  }
}
