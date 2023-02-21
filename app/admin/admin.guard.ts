import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleEnum } from "app/user/entities/user.entity";

@Injectable()
export class AdminGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any) {
    if (err || !user || user.role !== RoleEnum.ADMIN) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
