import { Module, CacheModule, CacheInterceptor } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import type { ClientOpts } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { config } from "app/config/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "./db/data-source";
import { AuthModule } from "./auth/auth.module";
import { BannersModule } from "./banners/banners.module";
import { NewsModule } from "./news/news.module";

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
    UserModule,
    AuthModule,
    BannersModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
