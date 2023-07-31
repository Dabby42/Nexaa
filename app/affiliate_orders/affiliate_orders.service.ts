import { Injectable } from "@nestjs/common";
import { CreateAffiliateOrderDto } from "./dto/create-affiliate_order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AffiliateOrders } from "./entities/affiliate_order.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";

@Injectable()
export class AffiliateOrdersService {
  constructor(@InjectRepository(AffiliateOrders) private affiliateOrderRepository: Repository<AffiliateOrders>, private userservice: UserService) {}

  async createAffiliateOrder(createAffiliateOrderDto: CreateAffiliateOrderDto) {
    const user = await this.userservice.findByUsername(createAffiliateOrderDto.affiliate_id);
    if (user) {
      const newAffiliateOrder = this.affiliateOrderRepository.create({ affiliate_id: user.id, order_id: createAffiliateOrderDto.order_id });
      return await this.affiliateOrderRepository.save(newAffiliateOrder);
    }
  }
}
