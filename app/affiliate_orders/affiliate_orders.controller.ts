import { Controller, Post, Body, Param, UseGuards, Request, Put, Delete, Get, Query } from "@nestjs/common";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AffiliateOrdersService } from "./affiliate_orders.service";
import { CreateAffiliateOrderDto } from "./dto/create-affiliate_order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { AdminGuard } from "app/admin/admin.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Affiliates")
@ApiBearerAuth("jwt")
@Controller("affiliate")
export class AffiliateOrderController {
  constructor(private readonly AffiliateOrdersService: AffiliateOrdersService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  async createAffiliateOrder(@Body() createAffiliateOrderDto: CreateAffiliateOrderDto) {
    await this.AffiliateOrdersService.createAffiliateOrder(createAffiliateOrderDto);
    return sendSuccess(null, "Affiliate order created successfully");
  }
}