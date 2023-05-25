import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { config } from "app/config/config";
import { RoleEnum, User } from "app/user/entities/user.entity";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Repository } from "typeorm";
import { Admin } from "../user/entities/admin.entity";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Admin) private adminRepository: Repository<Admin>) {
    super({
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User | Admin> {
    const { email, role } = payload;
    let user: User | Admin;
    if (role === RoleEnum.AFFILIATE) {
      user = await this.userRepository.findOne({ where: { email } });
    } else {
      user = await this.adminRepository.findOne({ where: { email } });
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;

    return { ...user, role };
  }
}
