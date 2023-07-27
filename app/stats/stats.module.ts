import { Module } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { LinksModule } from "../links/links.module";
import { StatsController } from "./stats.controller";
import { OrdersModule } from "../orders/orders.module";

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [LinksModule, OrdersModule],
})
export class StatsModule {}
