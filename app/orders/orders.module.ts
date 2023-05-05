import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { MagentoModule } from "../magento/magento.module";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Orders]), MagentoModule],
  exports: [OrdersService],
})
export class OrdersModule {}
