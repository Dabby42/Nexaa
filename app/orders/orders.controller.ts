import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AdminGuard } from "app/admin/admin.guard";

@ApiTags("Orders")
@ApiBearerAuth("jwt")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    await this.ordersService.createOrder(createOrderDto);
    return sendSuccess(null, "Order created successfully");
  }

  @Get()
  async findAllOrders() {
    const orders = await this.ordersService.findAllOrders();
    return sendSuccess(orders, "Orders retrieved successfully");
  }

  @Get(":id")
  async findSingleOrder(@Param("id") id: string) {
    const order = await this.ordersService.findSingleOrder(+id);
    return sendSuccess(order, "Order retrieved successfully");
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(+id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("all_orders")
  @ApiQuery({ name: "limit", type: "number", required: false})
  @ApiQuery({ name: "page", type: "number", required: false})
  async getAllOrders(@Query("page") page = 1, @Query("limit") limit = 20) {
    const orders = await this.ordersService.getAllOrders(page, limit);
    return sendSuccess(orders, "Orders retrieved successfully");
  }
}
