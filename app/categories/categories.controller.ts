import { Controller, Get, Post, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { AdminGuard } from "../admin/admin.guard";
import { UpdateCategoryStatusDto } from "./dto/update-category-status.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@ApiBearerAuth("jwt")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.createCategory(createCategoryDto);
    return sendSuccess(null, "Category created successfully");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  async findAllActiveCategories() {
    const categories = await this.categoriesService.findAllActiveCategories();
    return sendSuccess(categories, "Categories retrieved successfully");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(":id")
  async updateCategoryStatus(@Param("id") id: string, @Body() updateCategoryStatusDto: UpdateCategoryStatusDto) {
    await this.categoriesService.updateCategoryStatus(+id, updateCategoryStatusDto);
    return sendSuccess(null, "Category updated successfully");
  }
}
