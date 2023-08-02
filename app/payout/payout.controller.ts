import { Controller, Get, Post, Body, Param, UseGuards, Query, Res, Req, Logger } from "@nestjs/common";
import { PayoutService } from "./payout.service";
import { CreatePayoutDto } from "./dto/create-payout.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../admin/admin.guard";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { createObjectCsvWriter } from "csv-writer";
import { sendError, sendSuccess } from "../utils/helpers/response.helpers";
import * as fs from "fs";

@ApiTags("Payout")
@ApiBearerAuth("jwt")
@Controller("v1/payout")
export class PayoutController {
  private readonly logger = new Logger("PayoutService");
  constructor(private readonly payoutService: PayoutService) {}

  @Post()
  async create(@Body() createPayoutDto: CreatePayoutDto) {
    await this.payoutService.createPayout(createPayoutDto);
    return sendSuccess(null, "Payout created successfully");
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getAllPayouts(@Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.payoutService.getAllPayouts(page, limit);
    return sendSuccess(data, "Payout retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Get("affiliates/:id")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getAllAffiliatePayouts(@Param("id") id: number, @Query("page") page = 1, @Query("limit") limit = 20) {
    const data = await this.payoutService.getAllPayouts(page, limit, id);
    return sendSuccess(data, "Affiliate payout retrieved successfully");
  }

  @UseGuards(JwtGuard)
  @Get("generate-csv")
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  async getPayoutHistoryCSV(@Query("page") page = 1, @Query("limit") limit = 20, @Res() res, @Req() req) {
    const { id } = req.user;
    const payoutHistory: any = await this.payoutService.getAllPayouts(page, limit, id);
    const csvWriter = createObjectCsvWriter({
      path: `payout-history-${id}.csv`,
      header: [
        { id: "commission", title: "Commission" },
        { id: "payment_status", title: "Payment_status" },
        { id: "order", title: "Order" },
        { id: "payment_date", title: "Payment_date" },
      ],
    });

    csvWriter
      .writeRecords(payoutHistory.payouts)
      .then(() => {
        const fileContent = fs.readFileSync(`payout-history-${id}.csv`);
        res.header("Content-Disposition", `attachment; filename=payout-history-${id}.csv`);
        res.type("text/csv");
        res.send(fileContent);
        fs.unlinkSync(`payout-history-${id}.csv`);
      })
      .catch((error) => {
        this.logger.log(`Error generating CSV: ${error}`);
        res.status(500).send(sendError("Error generating CSV file."));
      });
  }
}
