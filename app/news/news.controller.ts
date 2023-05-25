import { Controller, Post, Body, Param, UseGuards, Request, Put, Delete, Get, Query } from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { AdminGuard } from "../admin/admin.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";

@ApiTags("News")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  async createNews(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    await this.newsService.create(createNewsDto, req.user);
    return sendSuccess(null, "News created.");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(":id")
  async updateNews(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    await this.newsService.update(+id, updateNewsDto);
    return sendSuccess(null, "News updated.");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(":id")
  async deleteNews(@Param("id") id: string) {
    await this.newsService.delete(+id);
    return sendSuccess(null, "News deleted.");
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getNews(@Query("page") page = 1, @Query("limit") limit = 3) {
    const data = await this.newsService.getMany(page, limit);
    return sendSuccess(data, "News fetched.");
  }
}
