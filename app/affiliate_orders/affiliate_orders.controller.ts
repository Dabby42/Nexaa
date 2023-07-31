import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AffiliateOrdersService } from "./affiliate_orders.service";
import { CreateAffiliateOrderDto } from "./dto/create-affiliate_order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { AdminGuard } from "app/admin/admin.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/auth.jwt.guard";

@ApiTags("FrontEnd Sync")
@ApiBearerAuth("jwt")
@Controller("v1/sync-order")
export class AffiliateOrderController {
  constructor(private readonly affiliateOrdersService: AffiliateOrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createAffiliateOrder(@Body() createAffiliateOrderDto: CreateAffiliateOrderDto) {
    await this.affiliateOrdersService.createAffiliateOrder(createAffiliateOrderDto);
    return sendSuccess(null, "Affiliate order created successfully");
  }
}
