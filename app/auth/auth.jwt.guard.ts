import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleEnum } from "../user/entities/user.entity";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any) {
    if (err || !user || user.role !== RoleEnum.CREATOR) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
