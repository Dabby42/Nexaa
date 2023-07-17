import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";
import type { ClientOpts } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { config } from "app/config/config";

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
  providers: [CacheService],
  exports: [CacheService],
})
export class CustomCacheModule {}
