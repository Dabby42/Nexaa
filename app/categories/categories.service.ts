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

  async findAllCategories() {
    return await this.categoryRepository.find();
  }

  async updateCategoryStatus(id: number, updateCategoryStatusDto: UpdateCategoryStatusDto) {
    await this.categoryRepository.update(id, updateCategoryStatusDto);
  }

  async getCommissionFromCategoryIds(ids: string[]) {
    //an array of the category tree, with root at beginning of array and lowest child at end.
    //we want to start from back and see first category that matches an affiliate category.

    //returning both the commission and name of the category so we can store on order table
    for (let i = ids.length - 1; i >= 0; i--) {
      const category = await this.categoryRepository.findOne({ where: { magento_id: +ids[i] } });
      if (category) return [category.commission, category.category_name];
    }
    //if it did not match any category, use 'Others' with id of 1
    const defaultCategory = await this.categoryRepository.findOneBy({ id: 1 });
    if (defaultCategory) return [defaultCategory.commission, defaultCategory.category_name];

    //just as a final default, but we do not expect this to run
    return [0.0, ""];
  }
}
