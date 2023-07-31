import { Test, TestingModule } from "@nestjs/testing";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Clicks } from "./entities/click.entity";
import { Links } from "./entities/link.entity";
import { Ips } from "./entities/ip.entity";
import { UnprocessableEntityException } from "@nestjs/common";
import { createCustomUrlData, getClickResponseMock, getIpResponseMock, getLinkResponseMock, recordClickResponseData, recordClicksData, userRequestMock } from "./link.mock";
import { CacheService } from "../cache/cache.service";
import { RabbitmqService } from "../rabbitmq/rabbitmq.service";

describe("LinksController", () => {
  let controller: LinksController;
  let linkRepository;
  let clickRepository;
  let ipRepository;

  const mockClickRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((clickData) =>
      Promise.resolve({
        id: 1,
        ...clickData,
      })
    ),
    insert: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(() => ({
        getMany: jest.fn(),
      })),
    })),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(getClickResponseMock.data)),
    findBy: jest.fn().mockImplementation(() => Promise.resolve(getClickResponseMock.data.Clicks)),
    update: jest.fn(),
  };
  const mockLinkRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((linkData) =>
      Promise.resolve({
        id: 1,
        ...linkData,
      })
    ),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue(getLinkResponseMock.data),
    getRawMany: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(getLinkResponseMock.data)),
    update: jest.fn(),
  };
  const mockIpRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((ipData) =>
      Promise.resolve({
        id: 1,
        ...ipData,
      })
    ),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(getIpResponseMock.data)),
    update: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn().mockImplementation(() => null),
    set: jest.fn(),
  };
  const mockRabbitMqService = {
    publishClickMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
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
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitMqService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    linkRepository = module.get(getRepositoryToken(Links));
    clickRepository = module.get(getRepositoryToken(Clicks));
    ipRepository = module.get(getRepositoryToken(Ips));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Generate a custom url", () => {
    it("should generate a custom url successfully", async () => {
      linkRepository.getRawOne.mockImplementationOnce(() => null);
      await controller.generateCustomUrl(createCustomUrlData, userRequestMock);
      expect(linkRepository.save).toHaveBeenCalled();
    });

    it("should return an error if save method throws ", async () => {
      linkRepository.getRawOne.mockImplementationOnce(() => null);
      linkRepository.save.mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(controller.generateCustomUrl(createCustomUrlData, userRequestMock)).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe("Record a click", () => {
    it("should record a click successfully", async () => {
      expect(await controller.recordClicks(recordClicksData, userRequestMock)).toStrictEqual(recordClickResponseData);
    });
  });
});
