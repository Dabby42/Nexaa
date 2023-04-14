import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category, CategoryStatusEnum } from "./entities/category.entity";
import { Repository } from "typeorm";
import { UpdateCategoryStatusDto } from "./dto/update-category-status.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.insert(category);
    } catch (error) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async findAllActiveCategories() {
    return await this.categoryRepository.findBy({
      status: CategoryStatusEnum.ACTIVE,
    });
  }

  async updateCategoryStatus(id: number, updateCategoryStatusDto: UpdateCategoryStatusDto) {
    await this.categoryRepository.update(id, updateCategoryStatusDto);
  }
}
