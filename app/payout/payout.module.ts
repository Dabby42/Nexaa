import { Module } from "@nestjs/common";
import { PayoutService } from "./payout.service";
import { PayoutController } from "./payout.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payout } from "./entities/payout.entity";

@Module({
  controllers: [PayoutController],
  providers: [PayoutService],
  imports: [TypeOrmModule.forFeature([Payout])],
  exports: [PayoutService],
})
export class PayoutModule {}
