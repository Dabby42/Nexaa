import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { config } from "app/config/config";
import { JwtStrategy } from "./auth.jwt.strategy";
import { UserModule } from "../user/user.module";
import { GoogleAuthService } from "./google-auth.service";
import { CustomCacheModule } from "../cache/cache.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { BasicAuth } from "./entities/basic-auth.entity";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleAuthService],
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiry },
    }),
    CustomCacheModule,
    TypeOrmModule.forFeature([User, BasicAuth]),
  ],
})
export class AuthModule {}
