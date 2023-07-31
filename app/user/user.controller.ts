import { Body, Controller, Get, NotFoundException, Param, Put, Query, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { UpdateBankDetailsDto } from "./dto/update-bank-details.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "app/admin/admin.guard";
import { SearchAndFilterAffiliateDto } from "./dto/searchAndFilterAffiliateDto";
import { UpdateAffiliateStatusDto } from "./dto/update-affiliate-status.dto";
import { RoleEnum } from "./entities/user.entity";

@ApiBearerAuth("jwt")
@ApiTags("User")
@Controller("v1/user")
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
    await this.userService.updateBankDetails(req.user.id, updateBankDetailsDto);
    return sendSuccess(null, "Bank Details Updated");
  }

  @UseGuards(AdminGuard)
  @Get("affiliates")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async fetchAllAffiliates(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.userService.fetchAllAffiliates(page, limit);
    return sendSuccess(data, "Affiliates retrieved successfully");
  }

  @UseGuards(AdminGuard)
  @Get("affiliate/:affiliate_id")
  async fetchAffiliateDetails(@Param("affiliate_id") affiliate_id: number) {
    const data = await this.userService.loadUser(affiliate_id, RoleEnum.AFFILIATE);
    if (!data) throw new NotFoundException("Affiliate not found.");
    return sendSuccess(data, "Affiliate data fetch success.");
  }

  @UseGuards(AdminGuard)
  @Get("affiliates/search")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @ApiQuery({ name: "status", type: "number", required: false })
  @ApiQuery({ name: "q", type: "string", required: false })
  async searchAndFilterAffiliates(@Query() searchAndFilterAffiliateDto: SearchAndFilterAffiliateDto) {
    const data = await this.userService.searchAndFilterAffiliates(searchAndFilterAffiliateDto);
    return sendSuccess(data, "Affiliates retrieved successfully");
  }

  @UseGuards(AdminGuard)
  @Get("users-stats")
  async fetchUserStats() {
    const data = await this.userService.fetchUserStats();
    return sendSuccess(data, "Users statistics retrieved successfully");
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
