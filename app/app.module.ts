import { Module, CacheModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import type { ClientOpts } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { config } from "app/config/config";
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

@Module({
  imports: [
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: config.redis.host,
      port: config.redis.port,
      database: config.redis.db,
      ttl: 172800,
      max: 300000,
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
