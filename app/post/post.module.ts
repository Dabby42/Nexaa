import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { CustomCacheModule } from "../cache/cache.module";
import { FacebookService } from "./facebook.service";

@Module({
  controllers: [PostController],
  providers: [PostService, FacebookService],
  imports: [TypeOrmModule.forFeature([Post]), CustomCacheModule],
})
export class PostModule {}
