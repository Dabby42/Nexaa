import { Test, TestingModule } from "@nestjs/testing";
import { StatsController } from "./stats.controller";
import {
  affiliateApprovedCommissionDataResponse,
  affiliateAverageCommissionsDataResponse,
  affiliateClicksRawOnceMockResponse,
  affiliateClicksSalesAndCommissionsDataResponse,
  affiliateCommissionsDataResponse,
  affiliateSalesAmountDataResponse,
  averageCommissionsRawManyMockData,
  campaignClicksCountResponse,
} from "./stats.mock";
import { OrdersService } from "../orders/orders.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Orders } from "../orders/entities/order.entity";
import { MagentoRepository } from "../magento/magento.repository";
import { LinksService } from "../links/links.service";
import { Links } from "../links/entities/link.entity";
import { Clicks } from "../links/entities/click.entity";
import { Ips } from "../links/entities/ip.entity";
import { CacheService } from "../cache/cache.service";
import { RabbitmqService } from "../rabbitmq/rabbitmq.service";
import { StatsService } from "./stats.service";

describe("StatsController", () => {
  let controller: StatsController;

  const mockOrderRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue(null),
    getRawMany: jest.fn().mockResolvedValue([]),
  };

  const mockLinksRepository = {
    ...mockOrderRepository,
  };
  const mockMagentoRepository = {};
  const mockClicksRepository = {
    ...mockOrderRepository,
    leftJoin: jest.fn().mockReturnThis(),
  };
  const mockIpRepository = {};
  const mockCacheService = {
    get: jest.fn().mockImplementation(() => null),
    set: jest.fn(),
  };
  const mockRabbitMqService = {
    publishClickMessage: jest.fn(),
  };

  const mockOrdersService = {
    totalSalesStats: jest.fn().mockImplementation(() => Promise.resolve(affiliateSalesAmountDataResponse.data)),
    getApprovedCommissions: jest.fn().mockImplementation((id) => Promise.resolve(affiliateApprovedCommissionDataResponse.data)),
    affiliateAverageCommissions: jest.fn().mockImplementation((id, start_date, end_date) => Promise.resolve(affiliateAverageCommissionsDataResponse.data)),
    totalSalesCountStats: jest.fn().mockImplementation((id) => Promise.resolve(affiliateClicksSalesAndCommissionsDataResponse.data.sales)),
    commissionsStats: jest.fn().mockImplementation((id) => Promise.resolve(affiliateCommissionsDataResponse.data)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        StatsService,
        OrdersService,
        LinksService,
        {
          provide: getRepositoryToken(Orders),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Links),
          useValue: mockLinksRepository,
        },
        {
          provide: getRepositoryToken(Clicks),
          useValue: mockClicksRepository,
        },
        {
          provide: getRepositoryToken(Ips),
          useValue: mockIpRepository,
        },
        {
          provide: MagentoRepository,
          useValue: mockMagentoRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitMqService,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  describe("Affiliate total sales amount", () => {
    it("should return affiliate sales amount data by date range successfully", async () => {
      expect(await controller.getAffiliateTotalSalesByDateRange({ start_date: "2020-03-03", end_date: "2045-01-01" }, { user: { id: 1 } })).toStrictEqual(
        affiliateSalesAmountDataResponse
      );
    });
  });

  describe("Affiliate total sales commissions", () => {
    it("should return affiliate commissions data by date range successfully", async () => {
      expect(await controller.getAffiliateTotalCommissionsByDateRange({ start_date: "2020-03-03", end_date: "2045-01-01" }, { user: { id: 1 } })).toStrictEqual(
        affiliateCommissionsDataResponse
      );
    });
  });

  describe("Affiliate average sales commissions", () => {
    it("should return affiliate average commissions data by date range successfully", async () => {
      mockOrderRepository.getRawMany.mockResolvedValueOnce(averageCommissionsRawManyMockData);
      expect(await controller.getAffiliateAverageCommissionsByDateRange({ start_date: "2020-03-03", end_date: "2045-01-01" }, { user: { id: 1 } })).toStrictEqual(
        affiliateAverageCommissionsDataResponse
      );
    });
  });

  describe("Affiliate clicks, sales and commissions", () => {
    it("should return affiliate clicks, sales and commissions", async () => {
      mockClicksRepository.getRawOne.mockResolvedValueOnce(affiliateClicksRawOnceMockResponse);
      expect(await controller.getAffiliateClicksSalesAndCommissionsCount({ user: { id: 1 } })).toStrictEqual(affiliateClicksSalesAndCommissionsDataResponse);
    });
  });

  describe("Affiliate approved commissions", () => {
    it("should return affiliate approved commissions", async () => {
      expect(await controller.getAffiliateApprovedCommissions({ user: { id: 1 } })).toStrictEqual(affiliateApprovedCommissionDataResponse);
    });
  });

  describe("Clicks count for campaigns", () => {
    it("should return clicks count for campaigns (ADMIN)", async () => {
      mockClicksRepository.getRawOne.mockResolvedValueOnce(campaignClicksCountResponse.data);
      expect(await controller.totalClicksCountForCampaigns({ start_date: "2020-03-03", end_date: "2045-01-01" })).toStrictEqual(campaignClicksCountResponse);
    });
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
