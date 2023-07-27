import { Injectable } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class StatsService {
  constructor(private orderService: OrdersService) {}

  async affiliateSalesByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.totalSalesCountStats(affiliate_id, start_date, end_date);
  }

  async affiliateCommissionsByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.commissionsStats(affiliate_id, start_date, end_date);
  }

  async affiliateAverageCommissionsByDateRange(affiliate_id: number, start_date: string, end_date: string) {
    return this.orderService.affiliateAverageCommissions(affiliate_id, start_date, end_date);
  }
}
