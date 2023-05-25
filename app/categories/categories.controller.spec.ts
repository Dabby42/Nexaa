import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { createCategoryData, createCategoryResponseData, getActiveCategoryResponseMock, getAllCategoryResponseMock, updateCategoryStatusData } from "./category.mock";
import { UnprocessableEntityException } from "@nestjs/common";

describe("CategoriesController", () => {
  let controller: CategoriesController;
  let categoryRepository;
  const mockCategoryRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    insert: jest.fn().mockImplementation((categoryData) =>
      Promise.resolve({
        id: 1,
        ...categoryData,
      })
    ),
    find: jest.fn().mockImplementation(() => Promise.resolve(getAllCategoryResponseMock.data)),
    findBy: jest.fn().mockImplementation(() => Promise.resolve(getActiveCategoryResponseMock.data)),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  describe("Create a category", () => {
    it("should create a category successfully", async () => {
      expect(await controller.createCategory(createCategoryData)).toStrictEqual(createCategoryResponseData);
    });

    it("should return an error if insert method throws ", async () => {
      categoryRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(controller.createCategory(createCategoryData)).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe("Fetch all active categories", () => {
    it("should fetch all active categories successfully", async () => {
      expect(await controller.findAllActiveCategories()).toStrictEqual(getActiveCategoryResponseMock);
    });
  });

  describe("Fetch all categories", () => {
    it("should fetch all categories successfully", async () => {
      expect(await controller.findAllCategories()).toStrictEqual(getAllCategoryResponseMock);
    });
  });

  describe("Update category status", () => {
    it("should update category status successfully", async () => {
      await controller.updateCategoryStatus("1", updateCategoryStatusData);
      expect(categoryRepository.update).toHaveBeenCalledWith(1, updateCategoryStatusData);
    });
  });
});
