import { Test, TestingModule } from "@nestjs/testing";
import { BannersController } from "./banners.controller";
import { BannersService } from "./banners.service";
import { Banner } from "./entities/banner.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { createBannerData, createBannerResponseData, getActiveBannersResponseMock } from "./banner.mock";

describe("BannersController", () => {
  let controller: BannersController;
  let bannerRepository;
  const mockBannerRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation(() =>
      Promise.resolve({
        ...createBannerResponseData.data,
      })
    ),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([])),
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
    bannerRepository = module.get(getRepositoryToken(Banner));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create a banner", () => {
    it("should create a banner successfully", async () => {
      expect(await controller.createBanner(createBannerData)).toStrictEqual(createBannerResponseData);
    });
  });

  describe("Fetch all banners", () => {
    it("should fetch all active banners successfully", async () => {
      bannerRepository.findAndCount.mockImplementationOnce(() => Promise.resolve([getActiveBannersResponseMock.data.banners, 1]));
      expect(await controller.getBanners()).toStrictEqual(getActiveBannersResponseMock);
    });
  });
});
