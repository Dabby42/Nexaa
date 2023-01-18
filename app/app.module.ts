import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { config } from 'app/config/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: config.redis.host,
      port: config.redis.port,
      database: config.redis.db,
      ttl: 172800,
      max: 300000,
    }),
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
