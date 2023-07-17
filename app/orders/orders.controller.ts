import { Controller, Get, Post, Body, Param, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../admin/admin.guard";
import { JwtGuard } from "../auth/auth.jwt.guard";
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
  @Get("commission-stats")
  async getCommissionStats() {
    const data = await this.ordersService.getCommissionStats();
    return sendSuccess(data, "Commission statistics retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Post("file-upload")
  @UseInterceptors(FileFilterInterceptor)
  async importPaidRecords(@UploadedFile("file") file: any) {
    await this.ordersService.importPaidRecords(file);
    return sendSuccess(null, "Paid commissions uploaded successfully");
  }
}
