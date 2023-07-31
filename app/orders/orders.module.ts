import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { MagentoModule } from "../magento/magento.module";
import { PayoutModule } from "../payout/payout.module";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Orders]), MagentoModule, PayoutModule],
  exports: [OrdersService],
})
export class OrdersModule {}
