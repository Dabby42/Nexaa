import { Injectable, UnauthorizedException, CACHE_MANAGER, Inject, ConflictException, BadRequestException } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "app/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { GoogleAuthService } from "./google-auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import * as crypto from "crypto";
import { Cache } from "cache-manager";
import { ConfirmResetPasswordTokenDto } from "./dto/confirm-reset-password-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
//import { config } from "../config/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async loginUser(loginUserDto: LoginUserDto, isSocial = false) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    const finalUser = { ...user };

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!isSocial) {
      const isMatch = await User.comparePasswords(loginUserDto.password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
      }
    }

    //For the web token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    delete finalUser.password;

    return sendSuccess({ token, user: finalUser }, "Login Success");
  }

  async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
    const email = await this.googleAuthService.authenticate(googleLoginDto.token);
    //Login user without password
    return await this.loginUser({ email, password: "" }, true);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      const token = crypto.randomBytes(20).toString("hex");

      this.cacheManager.set(token, existingUser.id, 60 * 10);

      //Send reset link as a mail to user
      // let body = `
      // <h2>Please click on the given link to reset your password</h2>
      // <p>${config.baseUrl}/v1/auth/reset-password/${token}</p>`;

      //SendEmailHelper(email, 'Reset Password Link' , body);
      return true;
    } else {
      throw new BadRequestException("User with account does not exist");
    }
  }

  async confirmResetPasswordToken(confirmResetPasswordTokenDto: ConfirmResetPasswordTokenDto) {
    const { token } = confirmResetPasswordTokenDto;

    const value = await this.cacheManager.get(token);

    if (!value) {
      throw new BadRequestException("Token is not valid");
    }

    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, token } = resetPasswordDto;

    const userId = await this.cacheManager.get(token);

    if (!userId) {
      throw new BadRequestException("Token is not valid");
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    const isMatch = await User.comparePasswords(newPassword, user.password);

    if (isMatch) {
      throw new ConflictException("Password used before");
    }

    user.password = await User.hashPassword(newPassword);

    await this.userRepository.save(user);

    //Send a mail of successful password reset
    //let body = "<h2>Your password has been changed, as you asked.</h2><br/><p>If you didn't ask to change your password,
    //we're here to help keep your account secure. Visit our support page for more info.</p>"
    //SendEmailHelper(user.email, 'Password Changed' , body);

    return user;
  }

  async changePassword(user, changePasswordDto: ChangePasswordDto) {
    const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
    const isMatch = await User.comparePasswords(changePasswordDto.oldPassword, foundUser.password);

    if (!isMatch) {
      throw new BadRequestException("Invalid password");
    }

    foundUser.password = await User.hashPassword(changePasswordDto.newPassword);
    await this.userRepository.save(foundUser);

    return foundUser;
  }
}
