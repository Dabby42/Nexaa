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
import { OAuth2Client } from 'google-auth-library';
import { config } from "../config/config";
import { GoogleLoginDto } from "./dto/google-login.dto";


const client = new OAuth2Client(config.social_login.google.client_id, config.social_login.google.client_secret);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('login/google')
  async googleLogin(@Body() googleLoginDto : GoogleLoginDto) {
    const ticket = await client.verifyIdToken({
      idToken: googleLoginDto.token,
      audience: config.social_login.google.client_id
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    return await this.authService.loginUser({ email, password : ''}, true);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Request() req) {
    return sendSuccess(req.user);
  }
}
