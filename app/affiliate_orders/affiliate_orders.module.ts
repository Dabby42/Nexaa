import { Module } from "@nestjs/common";
import { AffiliateOrderController } from "./affiliate_orders.controller";
import { AffiliateOrdersService } from "./affiliate_orders.service";
import { AffiliateOrders } from "./entities/affiliate_order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [AffiliateOrderController],
  providers: [AffiliateOrdersService],
  imports: [TypeOrmModule.forFeature([AffiliateOrders]), UserModule],
})
export class AffiliateOrdersModule {}
