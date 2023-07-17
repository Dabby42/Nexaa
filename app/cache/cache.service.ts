import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: string | object | number, ttl: number) {
    this.cacheManager.set(key, value, { ttl });
  }

  get(key: string | object | number) {
    return this.cacheManager.get(key);
  }

  delete(key: string) {
    this.cacheManager.del(key);
  }
}
