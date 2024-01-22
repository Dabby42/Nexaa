import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { config } from "app/config/config";
import { JwtStrategy } from "./auth.jwt.strategy";
import { UserModule } from "../user/user.module";
import { GoogleAuthService } from "./google-auth.service";
import { CustomCacheModule } from "../cache/cache.module";
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleAuthService, FacebookStrategy],
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.jwt.secret || "SECRET",
      signOptions: { expiresIn: config.jwt.expiry || "1h" },
    }),
    PassportModule.register({ defaultStrategy: 'facebook' }),
    CustomCacheModule,
  ],
})
export class AuthModule {
}
