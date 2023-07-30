import { Test, TestingModule } from "@nestjs/testing";
import { createOrderData, createOrdersMock, getAllOrdersResponseMock, getCommissionStatsMock, getOrderResponseMock } from "./orders.mock";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { MagentoRepository } from "../magento/magento.repository";
import { PayoutService } from "../payout/payout.service";

describe("OrderController", () => {
  let controller: OrdersController;

  const mockOrderRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((orderData) =>
      Promise.resolve({
        id: 1,
        ...orderData,
      })
    ),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockReturnValue(getCommissionStatsMock.data),
      getOne: jest.fn().mockReturnValue({}),
      execute: jest.fn().mockReturnThis(),
    })),
    find: jest.fn().mockImplementation(() => Promise.resolve(getAllOrdersResponseMock.data)),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(getOrderResponseMock.data)),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPayoutService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        MagentoRepository,
        {
          provide: getRepositoryToken(Orders),
          useValue: mockOrderRepository,
        },
        {
          provide: PayoutService,
          useValue: mockPayoutService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create an order", () => {
    it("should create an order successfully", async () => {
      expect(await controller.createOrder(createOrderData)).toStrictEqual(createOrdersMock);
    });
  });

  // describe("Get single order", () => {
  //   it("should retrieve an order successfully", async () => {
  //     const id = "1";
  //     expect(await controller.findSingleOrder(id)).toStrictEqual(getOrderResponseMock);
  //   });
  // });
});
