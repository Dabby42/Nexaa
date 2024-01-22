import { Module } from "@nestjs/common";
import { WorkService } from "./work.service";
import { WorkController } from "./work.controller";
import { CustomCacheModule } from "../cache/cache.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Work } from "./entities/work.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Work]), CustomCacheModule],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
