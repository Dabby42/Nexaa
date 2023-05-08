import { Body, Controller, Put, Get, UseGuards, Request, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { UpdateBankDetailsDto } from "./dto/update-bank-details.dto";
import { ApiBearerAuth, ApiTags, ApiQuery } from "@nestjs/swagger";
import { AdminGuard } from "app/admin/admin.guard";
import { SearchAndFilterAffiliateDto } from "./dto/searchAndFilterAffiliateDto";

@ApiBearerAuth("jwt")
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    await this.userService.updateUser(req.user.id, updateUserDto);
    return sendSuccess(null, "Profile updated.");
  }

  @UseGuards(JwtGuard)
  @Put("bank-details")
  async updateBankDetails(@Body() updateBankDetailsDto: UpdateBankDetailsDto, @Request() req) {
    return await this.userService.updateBankDetails(req.user.id, updateBankDetailsDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("affiliates")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async fetchAllAffiliates(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.userService.fetchAllAffiliates(page, limit);
    return sendSuccess(data, "Affiliates retrieved successfully");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("affiliates/search")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @ApiQuery({ name: "status", type: "number", required: false })
  @ApiQuery({ name: "q", type: "string", required: false })
  async searchAndFilterAffiliates(@Query() searchAndFilterAffiliateDto: SearchAndFilterAffiliateDto) {
    const data = await this.userService.searchAndFilterAffiliates(searchAndFilterAffiliateDto);
    return sendSuccess(data, "Affiliates retrieved successfully");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("users-stats")
  async fetchUserStats() {
    const data = await this.userService.fetchUserStats();
    return sendSuccess(data, "Users statistics retrieved successfully");
  }
}
