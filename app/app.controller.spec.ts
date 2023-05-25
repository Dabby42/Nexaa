import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LinksService } from "./links/links.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Clicks } from "./links/entities/click.entity";
import { Links } from "./links/entities/link.entity";
import { Ips } from "./links/entities/ip.entity";

describe("AppController", () => {
  let appController: AppController;
  const mockClickRepository = {};
  const mockLinkRepository = {};
  const mockIpRepository = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        LinksService,
        {
          provide: getRepositoryToken(Clicks),
          useValue: mockClickRepository,
        },
        {
          provide: getRepositoryToken(Links),
          useValue: mockLinkRepository,
        },
        {
          provide: getRepositoryToken(Ips),
          useValue: mockIpRepository,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe("Hello World!");
    });
  });
});
