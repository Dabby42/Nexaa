import { Test, TestingModule } from "@nestjs/testing";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { newsData, createNewsMock, updateNewsMock, userMock, deleteNewsMock, fetchNewsMock } from "./news.mock";
import { getRepositoryToken } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";

describe("NewsController", () => {
  let controller: NewsController;

  const mockNewsRepository = {
    save: jest.fn().mockImplementation((data) => {
      return {
        id: 1,
        ...data,
      };
    }),
    create: jest.fn().mockImplementation((data) => data),
    update: jest.fn().mockImplementation((id) => {
      if (id === 1) return { affected: 1 };
      return { affected: 0 };
    }),
    delete: jest.fn().mockImplementation((id) => {
      if (id === 1) return { affected: 1 };
      return { affected: 0 };
    }),
    getRawMany: jest.fn().mockReturnValue(fetchNewsMock.data.news),
    leftJoin: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnValue(4),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
  const mockCacheService = {
    get: jest.fn().mockImplementation(() => null),
    set: jest.fn(),
    refresh: jest.fn(),
    cachedData: jest.fn().mockImplementation((_, callback) => callback()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useValue: mockNewsRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create news", () => {
    it("should create news successfully", async () => {
      expect(await controller.createNews(newsData, { user: userMock })).toStrictEqual(createNewsMock);
    });
  });

  describe("Edit news", () => {
    it("should edit news successfully", async () => {
      expect(await controller.updateNews("1", newsData)).toStrictEqual(updateNewsMock);
    });

    it("should fail if news was not updated or not found", async () => {
      await expect(controller.updateNews("2", newsData)).rejects.toThrowError(BadRequestException);
    });
  });

  describe("Delete news", () => {
    it("should delete news successfully", async () => {
      expect(await controller.deleteNews("1")).toStrictEqual(deleteNewsMock);
    });

    it("should fail nd throw error if news is not found", async () => {
      await expect(controller.deleteNews("2")).rejects.toThrowError(NotFoundException);
    });
  });

  describe("Fetch news", () => {
    it("should fetch news successfully", async () => {
      expect(await controller.getNews()).toStrictEqual(fetchNewsMock);
    });
  });
});
