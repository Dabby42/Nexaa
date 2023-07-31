import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { config } from "app/config/config";
import { JwtStrategy } from "./auth.jwt.strategy";
import { UserModule } from "../user/user.module";
import { GoogleAuthService } from "./google-auth.service";
import { NotificationModule } from "../notification/notification.module";
import { CustomCacheModule } from "../cache/cache.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleAuthService],
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiry },
    }),
    NotificationModule,
    CustomCacheModule,
  ],
})
export class AuthModule {}
