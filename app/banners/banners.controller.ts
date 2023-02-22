import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AdminGuard } from "app/admin/admin.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Banners")
@ApiBearerAuth('jwt')
@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    return await this.bannersService.createBanner(createBannerDto);
  }
}
