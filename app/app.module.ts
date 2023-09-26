import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "./db/data-source";
import { AuthModule } from "./auth/auth.module";
import { ContactUsModule } from "./contact_us/contact_us.module";
import { NotificationModule } from "./notification/notification.module";
import { BannersModule } from "./banners/banners.module";
import { CategoriesModule } from "./categories/categories.module";
import { NewsModule } from "./news/news.module";
import { LinksModule } from "./links/links.module";
import { OrdersModule } from "./orders/orders.module";
import { AffiliateOrdersModule } from "./affiliate_orders/affiliate_orders.module";
import { RabbitmqModule } from "./rabbitmq/rabbitmq.module";
import { MagentoModule } from "./magento/magento.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CustomCacheModule } from "./cache/cache.module";
import { StatsModule } from "./stats/stats.module";
import { PayoutModule } from "./payout/payout.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    NotificationModule,
    ContactUsModule,
    BannersModule,
    CategoriesModule,
    NewsModule,
    LinksModule,
    OrdersModule,
    RabbitmqModule,
    MagentoModule,
    AffiliateOrdersModule,
    CustomCacheModule,
    StatsModule,
    PayoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
