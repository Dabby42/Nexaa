import { Controller, Post, Body, UseGuards, Get, Query, Put, Param } from "@nestjs/common";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AdminGuard } from "app/admin/admin.guard";
import { ApiBearerAuth, ApiTags, ApiQuery } from "@nestjs/swagger";
import { BannerSearchDto } from "./dto/banner-search.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { GeneralGuard } from "../auth/general.jwt.guard";

@ApiTags("Banners")
@ApiBearerAuth("jwt")
@Controller("v1/banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    return await this.bannersService.createBanner(createBannerDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getBanners(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.bannersService.loadBanners(page, limit);
    return sendSuccess(data);
  }
  @Get("search")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @ApiQuery({ name: "search", description: "search query for banner name", type: "string", required: false })
  @ApiQuery({ name: "filter", description: "old or new", type: "string", required: false })
  async searchBanners(@Query() searchDto: BannerSearchDto) {
    const data = await this.bannersService.searchBanners(searchDto);
    return sendSuccess(data);
  }

  @UseGuards(AdminGuard)
  @Put(":id")
  async updateBanner(@Param("id") id: number, @Body() updateBannerDto: UpdateBannerDto) {
    return await this.bannersService.updateBanner(id, updateBannerDto);
  }

  @UseGuards(AdminGuard)
  @Get("all")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getAllBanners(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.bannersService.loadAllBanners(page, limit);
    return sendSuccess(data);
  }

  @UseGuards(GeneralGuard)
  @Get(":id")
  async getBanner(@Param("id") id: number) {
    const data = await this.bannersService.getBanner(id);
    return sendSuccess(data);
  }
}
