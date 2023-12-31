import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleEnum } from "./entities/user.entity";
import { AddPreferenceDto } from "./dto/add-preference.dto";

@ApiBearerAuth("jwt")
@ApiTags("User")
@Controller("v1/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    await this.userService.updateUser(req.user.id, updateUserDto);
    return sendSuccess(null, "Profile updated.");
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async fetchUserDetails(@Param("id") user_id: number) {
    const data = await this.userService.loadUser(user_id, RoleEnum.CREATOR);
    if (!data) throw new NotFoundException("User not found.");
    return sendSuccess(data, "User data fetch success.");
  }

  @UseGuards(JwtGuard)
  @Put()
  async addPreference(@Body() addPreferenceDto: AddPreferenceDto, @Request() req) {
    await this.userService.addPreference(req.user.id, addPreferenceDto);
    return sendSuccess(null, "Preference added successfully.");
  }
}
