import { Test, TestingModule } from "@nestjs/testing";
import { AffiliateOrderController } from "./affiliate_orders.controller";
import { AffiliateOrdersService } from "./affiliate_orders.service";
import { AffiliateOrders } from "./entities/affiliate_order.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { createAffiliateOrderData, createAffiliateOrderResponseData } from "./affiliate_order.mock";
import { UserService } from "../user/user.service";

describe("AffiliateOrderController", () => {
  let controller: AffiliateOrderController;
  let AffiliateOrderRepository;
  const mockUserService = {
    findByUsername: jest.fn().mockImplementation((data) => data),
  };
  const mockAffiliateOrderRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation(() =>
      Promise.resolve({
        ...createAffiliateOrderData.data,
      })
    ),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([])),
    update: jest.fn().mockImplementation((dto) => dto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateOrderController],
      providers: [
        AffiliateOrdersService,
        {
          provide: getRepositoryToken(AffiliateOrders),
          useValue: mockAffiliateOrderRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    controller = module.get<AffiliateOrderController>(AffiliateOrderController);
    AffiliateOrderRepository = module.get(getRepositoryToken(AffiliateOrders));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create an affiliate order", () => {
    it("should create an affiliate order successfully", async () => {
      expect(await controller.createAffiliateOrder(createAffiliateOrderResponseData)).toStrictEqual(createAffiliateOrderData);
    });
  });
});
