import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID || "757175472897451",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "4bd8e38b31f3f373419d08269f140de0",
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://127.0.0.1:9000/facebook/callback",
      profileFields: ['id', 'emails', 'name'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { emails, id} = profile;
    console.log(1);
    const user = {
        email: emails[0].value,
        id,
        accessToken
    }
    done(null, user);
  }
}
