import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "app/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { sendSuccess } from "app/utils/helpers/response.helpers";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  async loginUser(loginUserDto: LoginUserDto, isSocial = false) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

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
    };
    const token = this.jwtService.sign(payload);

    return sendSuccess({ token }, "Login Success");
  }
}
