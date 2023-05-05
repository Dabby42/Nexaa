import { Module } from "@nestjs/common";
import { RabbitmqService } from "./rabbitmq.service";
import { OrdersModule } from "../orders/orders.module";

@Module({
  providers: [RabbitmqService],
  imports: [OrdersModule],
})
export class RabbitmqModule {}
