import { Module } from "@nestjs/common";
import { AdsService } from "./ads.service";
import { AdsController } from "./ads.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomCacheModule } from "../cache/cache.module";
import { Ad } from "./entities/ad.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ad]), CustomCacheModule],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
