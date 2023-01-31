import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from './auth.jwt.guard';
import { sendSuccess } from 'app/utils/helpers/response.helpers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Request() req) {
    return sendSuccess(req.user);
  }
}
