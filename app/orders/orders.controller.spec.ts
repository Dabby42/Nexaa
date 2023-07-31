import { Test, TestingModule } from "@nestjs/testing";
import { getAllOrdersResponseMock, getCommissionStatsMock, getOrderResponseMock } from "./orders.mock";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { MagentoRepository } from "../magento/magento.repository";
import { PayoutService } from "../payout/payout.service";

describe("OrderController", () => {
  let controller: OrdersController;
  let orderRepository;

  const mockOrderRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((orderData) =>
      Promise.resolve({
        id: 1,
        ...orderData,
      })
    ),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnValue(getCommissionStatsMock.data),
    getRawMany: jest.fn().mockReturnValue([]),
    leftJoin: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnValue(0),
    getOne: jest.fn().mockReturnValue({}),
    execute: jest.fn().mockReturnThis(),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([getAllOrdersResponseMock.data])),
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
    orderRepository = module.get(getRepositoryToken(Orders));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Get all orders", () => {
    it("Admin should retrieve all orders successfully", async () => {
      orderRepository.getRawMany.mockImplementationOnce(() => Promise.resolve(getAllOrdersResponseMock.data.orders));
      orderRepository.getCount.mockImplementationOnce(() => Promise.resolve(1));
      expect(await controller.getAllOrders({ page: "1", limit: "20" }, { user: { role: "admin" } })).toStrictEqual(getAllOrdersResponseMock);
    });
  });
});
