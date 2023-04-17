import { BadRequestException, CACHE_MANAGER, ConflictException, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEnum, User, UserStatusEnum } from "app/user/entities/user.entity";
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
import { Admin } from "../user/entities/admin.entity";
import { NotificationService } from "../notification/notification.service";
import { config } from "../config/config";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async loginUser(loginUserDto: LoginUserDto, isSocial = false, adminLogin = false) {
    let user;
    if (adminLogin) {
      user = await this.adminRepository.findOne({
        where: { email: loginUserDto.email },
      });
    } else {
      user = await this.userRepository.findOne({
        where: { email: loginUserDto.email },
      });
    }

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if ((adminLogin && !user.is_active) || (!adminLogin && user.status !== UserStatusEnum.APPROVED)) throw new UnauthorizedException("Your account is inactive.");

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
      role: adminLogin ? RoleEnum.ADMIN : RoleEnum.AFFILIATE,
    };
    const token = this.jwtService.sign(payload);

    delete user.password;

    return sendSuccess({ token, user }, "Login Success");
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

      this.cacheManager.set(token, existingUser.id, { ttl: 60 * 10 });

      const subject = "Konga Affiliate - Reset Password Link";
      try {
        await this.notificationService.send(
          "email",
          config.hermes.forgot_password.template_name,
          email,
          subject,
          config.hermes.forgot_password.sender,
          config.hermes.forgot_password.sender_id,
          {
            firstname: existingUser.first_name,
            token,
          }
        );
      } catch (e) {
        this.logger.log(e);
      }
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

    await this.cacheManager.del(token);

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
