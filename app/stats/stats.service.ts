import { Injectable } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { LinksService } from "../links/links.service";

@Injectable()
export class StatsService {
  constructor(private orderService: OrdersService, private linkService: LinksService) {}

  async affiliateSalesByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.totalSalesStats(affiliate_id, start_date, end_date);
  }

  async affiliateCommissionsByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.commissionsStats(affiliate_id, start_date, end_date);
  }

  async affiliateAverageCommissionsByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.affiliateAverageCommissions(affiliate_id, start_date, end_date);
  }

  async affiliateClicksSalesAndCommissionsCount(affiliate_id: number) {
    const totalSalesCount = await this.orderService.totalSalesCountStats(affiliate_id);
    const totalCommissionStats = await this.orderService.commissionsStats(affiliate_id);
    const totalClicksCount = await this.linkService.getTotalClicksCount(affiliate_id);

    return {
      sales: {
        pending: totalSalesCount.pending,
        declined: totalSalesCount.declined,
        approved: totalSalesCount.approved,
      },
      clicks: {
        total: totalClicksCount.clicksCount,
        repeated: Math.abs(parseInt(totalClicksCount.clicksCount) - parseInt(totalClicksCount.uniqueClicksCount)).toString(),
        unique: totalClicksCount.uniqueClicksCount,
      },
      commissions: {
        pending: totalCommissionStats.pending,
        declined: totalCommissionStats.declined,
        approved_paid: totalCommissionStats.approved_paid,
        approved_unpaid: totalCommissionStats.approved_unpaid,
      },
    };
  }

  async affiliateApprovedCommissions(affiliate_id: number) {
    return await this.orderService.getApprovedCommissions(affiliate_id);
  }
}
