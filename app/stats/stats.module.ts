import { Module } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { StatsController } from "./stats.controller";
import { OrdersModule } from "../orders/orders.module";

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [OrdersModule],
})
export class StatsModule {}
