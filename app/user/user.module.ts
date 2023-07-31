import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Admin } from "./entities/admin.entity";
import { LinksModule } from "../links/links.module";
import { NotificationModule } from "../notification/notification.module";
import { CustomCacheModule } from "../cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin]), LinksModule, NotificationModule, CustomCacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User, Admin])],
})
export class UserModule {}
