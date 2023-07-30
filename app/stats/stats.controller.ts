import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { DateRangeDto } from "./dto/date-range.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../admin/admin.guard";

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
  @Get("affiliate/total-commissions")
  async getAffiliateTotalCommissionsByDateRange(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.affiliateCommissionsByDateRange(req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Affiliate commissions data success.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliate/average-commissions")
  async getAffiliateAverageCommissionsByDateRange(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.affiliateAverageCommissionsByDateRange(req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Affiliate average commissions data success.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliate/clicks-sales-commissions")
  async getAffiliateClicksSalesAndCommissionsCount(@Req() req: any) {
    const data = await this.statsService.affiliateClicksSalesAndCommissionsCount(req.user.id);
    return sendSuccess(data, "Affiliate total clicks, sales, and commissions retrieved successfully.");
  }

  @UseGuards(AdminGuard)
  @Get("clicks-sales-commissions/:affiliate_id")
  async getClicksSalesAndCommissionsCount(@Param("affiliate_id") affiliate_id: number) {
    const data = await this.statsService.affiliateClicksSalesAndCommissionsCount(affiliate_id);
    return sendSuccess(data, "Affiliate total clicks, sales, and commissions retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliate/approved-commissions-by-month")
  async getAffiliateApprovedCommissions(@Req() req: any) {
    const data = await this.statsService.affiliateApprovedCommissions(req.user.id);
    return sendSuccess(data, "Affiliate approved commissions retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Get("affiliate/campaigns/clicks-count")
  async totalClicksCountForAffiliateCampaigns(@Query() dateRangeDto: DateRangeDto, @Req() req: any) {
    const data = await this.statsService.clickCountForCampaigns(null, req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Campaigns clicks count fetched.");
  }

  @UseGuards(JwtGuard)
  @Get("affiliate/campaigns/:campaign_id/clicks-count")
  async totalClicksCountForAffiliateCampaign(@Query() dateRangeDto: DateRangeDto, @Req() req: any, @Param("campaign_id") campaign_id: number) {
    const data = await this.statsService.clickCountForCampaigns(campaign_id, req.user.id, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Campaigns clicks count fetched.");
  }

  @Get("campaigns/clicks-count")
  async totalClicksCountForCampaigns(@Query() dateRangeDto: DateRangeDto) {
    const data = await this.statsService.clickCountForCampaigns(null, null, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Campaigns clicks count fetched.");
  }

  @Get("campaigns/:campaign_id/clicks-count")
  async totalClicksCountForCampaign(@Query() dateRangeDto: DateRangeDto, @Param("campaign_id") campaign_id: number) {
    const data = await this.statsService.clickCountForCampaigns(campaign_id, null, dateRangeDto.start_date, dateRangeDto.end_date);
    return sendSuccess(data, "Campaigns clicks count fetched.");
  }
}
