import { Test, TestingModule } from "@nestjs/testing";
import { PayoutController } from "./payout.controller";
import { PayoutService } from "./payout.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Payout } from "./entities/payout.entity";
import { createPayoutResponseMock, getAllPayoutResponseMock, newPayOut } from "./payout.mock";

describe("PayoutController", () => {
  let controller: PayoutController;
  const mockPayoutRepository = {
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
    getRawMany: jest.fn().mockReturnValue(getAllPayoutResponseMock.data.payouts),
    leftJoin: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnValue(2),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayoutController],
      providers: [
        PayoutService,
        {
          provide: getRepositoryToken(Payout),
          useValue: mockPayoutRepository,
        },
      ],
    }).compile();

    controller = module.get<PayoutController>(PayoutController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Create payout", () => {
    it("should create a payout successfully", async () => {
      expect(await controller.create(newPayOut)).toStrictEqual(createPayoutResponseMock);
    });
  });

  describe("Get all payouts", () => {
    it("Admin should retrieve all affiliate payout successfully", async () => {
      expect(await controller.getAllPayouts()).toStrictEqual(getAllPayoutResponseMock);
    });
    it("Affiliates should retrieve their payout successfully", async () => {
      getAllPayoutResponseMock.message = "Affiliate payout retrieved successfully";
      expect(await controller.getAllAffiliatePayouts(1)).toStrictEqual(getAllPayoutResponseMock);
    });
  });
});
