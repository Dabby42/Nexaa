import { Controller, Get, Post, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { AdminGuard } from "../admin/admin.guard";
import { UpdateCategoryStatusDto } from "./dto/update-category-status.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@ApiBearerAuth("jwt")
@Controller("v1/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.createCategory(createCategoryDto);
    return sendSuccess(null, "Category created successfully");
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAllCategories() {
    const categories = await this.categoriesService.findAllCategories();
    return sendSuccess(categories, "All categories retrieved successfully");
  }

  @UseGuards(AdminGuard)
  @Get("active")
  async findAllActiveCategories() {
    const categories = await this.categoriesService.findAllActiveCategories();
    return sendSuccess(categories, "Categories retrieved successfully");
  }

  @UseGuards(AdminGuard)
  @Patch(":id")
  async updateCategoryStatus(@Param("id") id: string, @Body() updateCategoryStatusDto: UpdateCategoryStatusDto) {
    await this.categoriesService.updateCategoryStatus(+id, updateCategoryStatusDto);
    return sendSuccess(null, "Category updated successfully");
  }
}
