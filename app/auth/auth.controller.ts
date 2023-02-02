import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtGuard } from "./auth.jwt.guard";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post("register")
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Post("login")
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post("login/google")
  async loginUserWithGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLoginDto);
  }

  @UseGuards(JwtGuard)
  @Get("me")
  async getMe(@Request() req) {
    return sendSuccess(req.user);
  }
}
