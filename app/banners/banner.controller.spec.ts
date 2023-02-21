import { Test, TestingModule } from "@nestjs/testing";
import { BannersController } from "./banners.controller";
import { BannersService } from "./banners.service";
import { Banner } from "./entities/banner.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { createBannerData, createBannerResponseData } from "./banner.mock";

describe("BannersController", () => {
  let controller: BannersController;
  const mockBannerRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation(() =>
      Promise.resolve({
        ...createBannerResponseData.data,
      })
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersController],
      providers: [
        BannersService,
        {
          provide: getRepositoryToken(Banner),
          useValue: mockBannerRepository,
        },
      ],
    }).compile();
    controller = module.get<BannersController>(BannersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create a banner", () => {
    it("should create a banner successfully", async () => {
      expect(await controller.createBanner(createBannerData)).toStrictEqual(createBannerResponseData);
    });
  });
});
