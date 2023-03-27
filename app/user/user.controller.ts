import { Body, Controller, Put, UseGuards, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { UpdateBankDetailsDto } from "./dto/update-bank-details.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../admin/admin.guard";
import { UpdateAffiliateStatusDto } from "./dto/update-affiliate-status.dto";

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

  @UseGuards(AdminGuard)
  @Put("affiliate/approve")
  async approveAffiliate(@Body() updateAffiliateStatusDto: UpdateAffiliateStatusDto, @Request() req) {
    await this.userService.approveAffiliate(updateAffiliateStatusDto.affiliate_id, req.user);
    return sendSuccess(null, "Affiliate has been approved.");
  }

  @UseGuards(AdminGuard)
  @Put("affiliate/disable")
  async rejectAffiliate(@Body() updateAffiliateStatusDto: UpdateAffiliateStatusDto, @Request() req) {
    await this.userService.disableAffiliate(updateAffiliateStatusDto.affiliate_id, updateAffiliateStatusDto.reason, req.user);
    return sendSuccess(null, "Affiliate has been disabled.");
  }
}
