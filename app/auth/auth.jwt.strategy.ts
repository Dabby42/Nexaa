import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'app/config/config';
import { User } from 'app/user/entities/user.entity';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> {
    const { email } = payload;
    const user: User = await this.userRepository.findOne({ where: { email } });

    delete user.password;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
