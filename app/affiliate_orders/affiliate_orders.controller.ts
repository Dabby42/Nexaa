import { Controller, Post, Body, Param, UseGuards, Request, Put, Delete, Get, Query } from "@nestjs/common";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AffiliateOrdersService } from "./affiliate_orders.service";
import { CreateAffiliateOrderDto } from "./dto/create-affiliate_order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";


@Controller()
export class AffiliateOrderController {
  constructor(private readonly AffiliateOrdersService: AffiliateOrdersService) {}
  
  @Post()
  async create(@Body() createAffiliateOrderDto: CreateAffiliateOrderDto) {
    await this.AffiliateOrdersService.create(createAffiliateOrderDto);
    return sendSuccess(null, "Affiliate order created successfully");
  }
}