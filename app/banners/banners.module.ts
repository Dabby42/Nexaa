import { Module } from "@nestjs/common";
import { BannersService } from "./banners.service";
import { BannersController } from "./banners.controller";
import { UserModule } from "app/user/user.module";
import { Banner } from "./entities/banner.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomCacheModule } from "../cache/cache.module";

@Module({
  controllers: [BannersController],
  providers: [BannersService],
  imports: [UserModule, TypeOrmModule.forFeature([Banner]), CustomCacheModule],
})
export class BannersModule {}
