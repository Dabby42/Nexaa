import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: string | object | number, ttl: number) {
    this.cacheManager.set(key, value, { ttl });
  }

  async get(key: string | object | number) {
    return await this.cacheManager.get(key);
  }

  async delete(key: string) {
    return await this.cacheManager.del(key);
  }

  async refresh(pattern: string) {
    const keys = await this.cacheManager.keys(`*${pattern}*`);
    if (keys.length === 0) return 0;
    const deletions = await Promise.all(keys.map((key) => this.delete(key)));
    return deletions.reduce((acc, current) => acc + current, 0);
  }

  async cachedData(key, callback, ttl = 60 * 60 * 24) {
    let data = await this.get(key);
    if (!data) {
      data = await callback();
      if (data) this.set(key, data, ttl);
    }
    return data;
  }
}
