import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

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
}
