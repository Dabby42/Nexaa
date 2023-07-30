import { Test, TestingModule } from "@nestjs/testing";
import { PayoutController } from "./payout.controller";
import { PayoutService } from "./payout.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Payout } from "./entities/payout.entity";

describe("PayoutController", () => {
  let controller: PayoutController;
  const mockPayoutRepository = {};

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
});
