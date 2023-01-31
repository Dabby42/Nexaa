import { Module } from '@nestjs/common';
import { AppService } from '../app.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AppService],
})
export class AuthModule {}
