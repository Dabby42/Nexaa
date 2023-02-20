import { Test, TestingModule } from "@nestjs/testing";
import { BannersController } from "./banners.controller";
import { BannersService } from "./banners.service";
import { Banner } from "./entities/banner.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { createBannerData, createBannerRequestMock, createBannerResponseData, notAdminRequestMock } from "./banner.mock";
import { UnauthorizedException } from "@nestjs/common";

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
    bannerRepository = module.get(getRepositoryToken(Banner));
    controller = module.get<BannersController>(BannersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create a banner", () => {
    it("should create a banner successfully", async () => {
      expect(await controller.createBanner(createBannerData, createBannerRequestMock)).toStrictEqual(createBannerResponseData);
    });

    it("should return error if user is not an admin", async () => {
      bannerRepository.save.mockImplementationOnce(() => Promise.resolve(true));

      await expect(controller.createBanner(createBannerData, notAdminRequestMock)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
