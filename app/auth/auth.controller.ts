import { Body, Controller, Post } from "@nestjs/common";
import { OAuth2Client } from 'google-auth-library';
import { config } from "../config/config";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { AuthService } from './auth.service'

const client = new OAuth2Client(config.social_login.google.client_id, config.social_login.google.client_secret);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService) {}

  @Post('login/google')
  async googleLogin(@Body() googleLoginDto : GoogleLoginDto) : Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: googleLoginDto.token,
      audience: config.social_login.google.client_id
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    this.authService.loginUser({ email, password : ''}, true);
    return email;
  }


}