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
      host: config.redis.host || "127.0.0.1",
      port: config.redis.port || "6379",
      database: config.redis.db || "0",
      ttl: 172800,
      max: 300000,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CustomCacheModule {}
