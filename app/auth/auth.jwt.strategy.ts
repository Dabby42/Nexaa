import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { config } from "app/config/config";
import { User } from "app/user/entities/user.entity";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../user/user.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private userService: UserService) {
    super({
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> {
    const { id, role } = payload;
    const user = await this.userService.loadUser(id, role);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, role };
  }
}
