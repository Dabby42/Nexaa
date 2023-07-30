import { Controller, Get, Post, Param, UseGuards, Query, UploadedFile, UseInterceptors, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "app/admin/admin.guard";
import { FileFilterInterceptor } from "./file-upload.interceptor";
import { OrderQueryDto } from "./dto/order-query.dto";
import { RoleEnum } from "../user/entities/user.entity";
import { GeneralGuard } from "../auth/general.jwt.guard";

@ApiTags("Commissions")
@ApiBearerAuth("jwt")
@Controller("commissions")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(GeneralGuard)
  @Get()
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @ApiQuery({ name: "commission_payment_status", type: "string", required: false })
  @ApiQuery({ name: "commission_status", type: "string", required: false })
  @ApiQuery({ name: "affiliate_id", description: "This is for when admin wants to get commissions of a particular affiliate. ", type: "number", required: false })
  async getAllOrders(@Query() orderQueryDto: OrderQueryDto, @Req() req: any) {
    //if it is an affiliate calling this endpoint, ensure they only get their orders.
    if (req.user.role === RoleEnum.AFFILIATE) orderQueryDto.affiliate_id = String(req.user.id);
    const orders = await this.ordersService.getAllOrders(orderQueryDto);
    return sendSuccess(orders, "Orders retrieved successfully");
  }

  @UseGuards(GeneralGuard)
  @Get(":id")
  async findSingleOrder(@Param("id") id: string) {
    const order = await this.ordersService.findSingleOrder(+id);
    return sendSuccess(order, "Order retrieved successfully");
  }

  @UseGuards(AdminGuard)
  @Post("file-upload")
  @UseInterceptors(FileFilterInterceptor)
  async importPaidRecords(@UploadedFile("file") file: any) {
    await this.ordersService.importPaidRecords(file);
    return sendSuccess(null, "Paid commissions uploaded successfully");
  }
}
