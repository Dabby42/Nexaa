import { Controller, Get, Post, Body, Param, UseGuards, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "app/auth/auth.jwt.guard";
import { AdminGuard } from "app/admin/admin.guard";
import { FileFilterInterceptor } from "./file-upload.interceptor";

@ApiTags("Orders")
@ApiBearerAuth("jwt")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @Get("commission-stats/:id")
  async getCommissionStats(@Param("id") id: string) {
    const data = await this.ordersService.commissionsStats(+id);
    return sendSuccess(data, "Commission statistics retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Post("file-upload")
  @UseInterceptors(FileFilterInterceptor)
  async importPaidRecords(@UploadedFile("file") file: any) {
    await this.ordersService.importPaidRecords(file);
    return sendSuccess(null, "Paid commissions uploaded successfully");
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get("orders")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getAllOrders(@Query("page") page = 1, @Query("limit") limit = 20) {
    const orders = await this.ordersService.getAllOrders(page, limit);
    return sendSuccess(orders, "Orders retrieved successfully");
  }
}
