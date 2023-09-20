import { Injectable } from "@nestjs/common";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payout } from "./entities/payout.entity";

@Injectable()
export class PayoutService {
  constructor(@InjectRepository(Payout) private readonly payoutRepository: Repository<Payout>) {}

  async createPayout(createPayoutDto: CreatePayoutDto) {
    const newPayOut = this.payoutRepository.create(createPayoutDto);
    await this.payoutRepository.save(newPayOut);
  }

  async getAllPayouts(page: number, limit: number, affiliate_id?: number) {
    const query = this.payoutRepository
      .createQueryBuilder("payout")
      .select(["payout.created_at AS payment_date", "order.commission_payment_status AS payment_status", "order.commission AS commission", "order.order_id AS order_number"])
      .leftJoin("payout.affiliate_id", "affiliate")
      .leftJoin("payout.order_id", "order")
      .orderBy("payout.created_at", "DESC")
      .where({ affiliate_id })
      .skip((+page - 1) * limit)
      .limit(+limit);

    const payoutList = await query.getRawMany();
    const count = await query.getCount();

    const payouts = payoutList.map((payout) => {
      payout["payment_date"] = new Date(payout.payment_date).toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return payout;
    });
    const pages = Math.ceil(count / +limit);
    return {
      payouts,
      count,
      current_page: page,
      pages,
    };
  }
}
