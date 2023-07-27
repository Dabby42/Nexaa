import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { DateRangeDto } from "./dto/date-range.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("stats")
@ApiBearerAuth("jwt")
@ApiTags("Stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtGuard)
  @Get("affiliates/total-sales")
  async getAffiliateTotalSalesByDateRange(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.affiliateSalesByDateRange(req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Affiliate sales data success.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliates/total-commissions")
  async getAffiliateTotalCommissionsByDateRange(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.affiliateCommissionsByDateRange(req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Affiliate commissions data success.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliates/average-commissions")
  async getAffiliateAverageCommissionsByDateRange(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.affiliateAverageCommissionsByDateRange(req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Affiliate average commissions data success.");
  }
}
