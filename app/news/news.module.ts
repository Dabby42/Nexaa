import { Module } from "@nestjs/common";
import { NewsService } from "./news.service";
import { NewsController } from "./news.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { CustomCacheModule } from "../cache/cache.module";

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [TypeOrmModule.forFeature([News]), CustomCacheModule],
})
export class NewsModule {}
