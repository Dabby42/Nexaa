import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { JwtGuard } from "app/auth/auth.jwt.guard";

@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createBanner(@Body() createBannerDto: CreateBannerDto, @Request() req) {
    return await this.bannersService.createBanner(req.user.role, createBannerDto);
  }
}
