import { Injectable, Logger } from "@nestjs/common";
import { CreateAffiliateOrderDto } from "./dto/create-affiliate_order.dto";
import { UpdateAffiliateOrderDto } from "./dto/update-affiliate_order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AffiliateOrders } from "./entities/affiliate_order.entity";
import { Repository } from "typeorm";

@Injectable()
export class AffiliateOrdersService {
  constructor(@InjectRepository(AffiliateOrders) private affiliateOrderRepository: Repository<AffiliateOrders>) {}

  async createAffiliateOrder(createAffiliateOrderDto: CreateAffiliateOrderDto) {
    const newAffiliateOrder = this.affiliateOrderRepository.create(createAffiliateOrderDto);
    return await this.affiliateOrderRepository.save(newAffiliateOrder);
  }
}
