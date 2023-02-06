import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
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

@Controller("auth")
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
  @Get("me")
  async getMe(@Request() req) {
    return sendSuccess(req.user);
  }
}
