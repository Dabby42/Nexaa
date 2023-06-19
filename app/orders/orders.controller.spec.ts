import { Test, TestingModule } from "@nestjs/testing";
import { createOrdersMock, getAllOrdersResponseMock, getOrderResponseMock } from "./orders.mock";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { MagentoRepository } from "../magento/magento.repository";

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
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(() => ({
        getMany: jest.fn(),
      })),
    })),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([getAllOrdersResponseMock.data])),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(getOrderResponseMock.data)),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    orderRepository = module.get(getRepositoryToken(Orders));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create an order", () => {
    it("should create an order successfully", async () => {
      expect(await controller.createOrder({})).toStrictEqual(createOrdersMock);
    });
  });

  describe("Get single order", () => {
    it("should retrieve an order successfully", async () => {
      const id = "1";
      expect(await controller.findSingleOrder(id)).toStrictEqual(getOrderResponseMock);
    });
  });

  describe("Get all orders", () => {
    it("Admin should retrieve all orders successfully", async () => {
      orderRepository.findAndCount.mockImplementationOnce(() => Promise.resolve([getAllOrdersResponseMock.data.orders, 1]));
      expect(await controller.getAllOrders()).toStrictEqual(getAllOrdersResponseMock);
    });
  });
});
