import { Injectable } from "@nestjs/common";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Payout } from "./entities/payout.entity";

@Injectable()
export class PayoutService {
  constructor(@InjectRepository(Payout) private readonly payoutRepository: Repository<Payout>) {}

  async createPayout(createPayoutDto: CreatePayoutDto) {
    const newPayOut = this.payoutRepository.create(createPayoutDto);
    await this.payoutRepository.save(newPayOut);
  }

  async getAllPayouts(page: number, limit: number, affiliate_id?: number) {
    const findOptions: FindManyOptions<Payout> = {
      order: { created_at: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["affiliate_id", "order_id"],
    };
    if (affiliate_id)
      findOptions.where = {
        affiliate_id: Number(affiliate_id),
      };
    const [payoutList, count] = await this.payoutRepository.findAndCount(findOptions);
    const payouts = payoutList.map((payout) => {
      payout["commission"] = payout.order_id["commission"];
      payout["payment_status"] = payout.order_id["commission_payment_status"];
      payout["order"] = payout.order_id["order_id"];
      payout["payment_date"] = new Date(payout.updated_at).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      delete payout.created_at;
      delete payout.id;
      delete payout.affiliate_id;
      delete payout.updated_at;
      delete payout.order_id;
      return payout;
    });

    const pages = Math.ceil(count / limit);

    return {
      payouts,
      count,
      current_page: page,
      pages,
    };
  }
}
