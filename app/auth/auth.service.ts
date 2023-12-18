import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEnum, User } from "app/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { GoogleAuthService } from "./google-auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import * as crypto from "crypto";
import { ConfirmResetPasswordTokenDto } from "./dto/confirm-reset-password-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CacheService } from "../cache/cache.service";
import { BasicAuth } from "./entities/basic-auth.entity";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(BasicAuth) private basicAuthRepository: Repository<BasicAuth>,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    private cacheService: CacheService
  ) {}

  async loginUser(loginUserDto: LoginUserDto, isSocial = false, brand = false) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!isSocial) {
      //const isMatch = await User.comparePasswords(loginUserDto.password, user.password);
      // if (!isMatch) {
      //   throw new UnauthorizedException("Invalid email or password");
      // }
    }

    //For the web token
    const payload = {
      id: user.id,
      email: user.email,
      role: brand ? RoleEnum.BRAND : RoleEnum.CREATOR,
    };
    const token = this.jwtService.sign(payload);

    const fullUserDetails = await this.basicAuthRepository
      .createQueryBuilder("basicAuth")
      .select("user.*")
      .leftJoin("basicAuth.user_id", "user")
      .where("basicAuth.user_id = :user_id", { user_id: user.id })
      .getRawOne();

    return sendSuccess({ token, fullUserDetails }, "Login Success");
  }

  async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
    const email = await this.googleAuthService.authenticate(googleLoginDto.token);
    //Login user without password
    //return await this.loginUser({ email, password: "" }, true);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      const token = crypto.randomBytes(20).toString("hex");

      this.cacheService.set(token, existingUser.id, 60 * 10);

      try {
        // send notification
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

    const value = await this.cacheService.get(token);

    if (!value) {
      throw new BadRequestException("Token is not valid");
    }

    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, token } = resetPasswordDto;

    const userId = await this.cacheService.get(token);

    if (!userId) {
      throw new BadRequestException("Token is not valid");
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    const userAuthDetails = await this.basicAuthRepository.findOne({ where: { user_id: { id: user.id } } });

    const isMatch = await User.comparePasswords(newPassword, userAuthDetails.password);

    if (isMatch) {
      throw new ConflictException("Password used before");
    }

    userAuthDetails.password = await User.hashPassword(newPassword);

    await this.basicAuthRepository.save(userAuthDetails);

    await this.cacheService.delete(token);

    return user;
  }

  async changePassword(user, changePasswordDto: ChangePasswordDto) {
    // const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
    const userAuthDetails = await this.basicAuthRepository.findOne({ where: { user_id: { id: user.id } } });

    const isMatch = await User.comparePasswords(changePasswordDto.oldPassword, userAuthDetails.password);

    if (!isMatch) {
      throw new BadRequestException("Invalid password");
    }
    const newPasssword = await User.hashPassword(changePasswordDto.newPassword);
    userAuthDetails.password = newPasssword;
    await this.basicAuthRepository.save(userAuthDetails);

    user.password = newPasssword;
    return user;
  }
}
