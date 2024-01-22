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
      host: config.redis.host || "redis-17561.c326.us-east-1-3.ec2.cloud.redislabs.com",
      port: config.redis.port || "17561",
      password: "OoiafGit1hXOFHqyqnAspCeQm8emP6Pp",
      database: "Nwafor-free-db",
      ttl: 172800,
      max: 300000,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CustomCacheModule {}
