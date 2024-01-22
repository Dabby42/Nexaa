import { Controller, Post, Body, Get, UseGuards, Request, Response } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtGuard } from "./auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ConfirmResetPasswordTokenDto } from "./dto/confirm-reset-password-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { GeneralGuard } from "./general.jwt.guard";
import { AuthGuard } from '@nestjs/passport';
import fastifyPassport from '@fastify/passport';


@ApiTags("Auth")
@Controller("v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post("register")
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
    return sendSuccess(null, "Account created successfully");
  }

  @Post("login")
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post("login/google")
  async loginUserWithGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLoginDto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return sendSuccess(null, "Email has been sent successfully");
  }

  @Post("confirm-reset-password-token")
  async confirmResetPasswordToken(@Body() confirmResetPasswordTokenDto: ConfirmResetPasswordTokenDto) {
    await this.authService.confirmResetPasswordToken(confirmResetPasswordTokenDto);
    return sendSuccess(null, "Token is valid");
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return sendSuccess(null, "Password changed successfully");
  }

  @UseGuards(JwtGuard)
  @Post("change-password")
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(req.user, changePasswordDto);
    return sendSuccess(null, "Password updated successfully");
  }

  @UseGuards(GeneralGuard)
  @Get("me")
  async getMe(@Request() req) {
    return sendSuccess(req.user);
  }

  @UseGuards(AuthGuard('facebook'))
  @Get('facebook')
  async facebookLogin() {
  }

  @UseGuards(AuthGuard('facebook'))
  @Get('facebook/callback')
  async facebookLoginCallback(@Request() req: any, @Response() res: any) {
        // Redirect to the desired page after successful login
        return res.redirect('/auth/me');
    //await this.authService.facebookLoginCallback(req.user)
    //return sendSuccess(null, "Successfully logged in user");
  }
}
