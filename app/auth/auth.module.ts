import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'app/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'app/config/config';
import { JwtStrategy } from './auth.jwt.strategy';
import { UserModule } from "../user/user.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiry },
    }),
    UserModule
  ],
})
export class AuthModule {}
