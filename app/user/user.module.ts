import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CustomCacheModule } from "../cache/cache.module";
import { BasicAuth } from "../auth/entities/basic-auth.entity";
import { UserPreference } from "./entities/user-preference.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, BasicAuth, UserPreference]), CustomCacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
