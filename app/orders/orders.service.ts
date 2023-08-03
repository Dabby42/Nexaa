import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CommissionPaymentStatusEnum, CommissionStatusEnum, Orders } from "./entities/order.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MagentoRepository } from "../magento/magento.repository";
import { parse } from "@fast-csv/parse";
import { Readable } from "stream";
import { PayoutService } from "../payout/payout.service";
import { OrderQueryDto } from "./dto/order-query.dto";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger("OrderService");

  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    private readonly magentoRepository: MagentoRepository,
    private readonly payoutService: PayoutService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  async findSingleOrder(order_id: string) {
    return await this.orderRepository.createQueryBuilder("order").select(["`order`.*"]).where({ order_id }).getRawOne();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateOrderStatus() {
    const statusArr = ["processing", "new"];
    const data = await this.orderRepository
      .createQueryBuilder()
      .select('GROUP_CONCAT(CONCAT("\'",order_id, "\'")) AS order_ids')
      .where("`status` IN (:...statusArr)", { statusArr })
      .getRawOne();

    if (data.order_ids) {
      const orderDetails = await this.magentoRepository.getOrder(data.order_ids);
      if (orderDetails.length) {
        const increment_ids = orderDetails.map((order) => order.increment_id).join('","');
        const obj = {};
        for (const ord of orderDetails) {
          if (!obj[ord.state]) {
            obj[ord.state] = [];
          }
          obj[ord.state].push(ord.increment_id);
        }
        let case_statement = "";
        for (const key in obj) {
          case_statement += `WHEN order_id IN ("${obj[key].join('","')}") THEN "${key}"`;
        }

        await this.orderRepository.query(`UPDATE orders SET status = CASE ${case_statement} ELSE status END WHERE order_id IN ( "${increment_ids}")`);

        this.logger.log(`Order Status Updated Successfully for orderIds: ${increment_ids} `);
      } else {
        this.logger.log("No orders match from Magento.");
      }

      return;
    }

    this.logger.log(`No orders to update.`);
  }

  async findAllOrders() {
    return await this.orderRepository.find();
  }

  getMonthsFromNowTill9MonthsBack() {
    const today = new Date();
    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(today.getMonth() - 8);

    const months = [];
    while (nineMonthsAgo <= today) {
      const year = nineMonthsAgo.getFullYear();
      const month = nineMonthsAgo.getMonth() + 1; // Add 1 to adjust month range (1 to 12)
      months.push(`${year}-${month.toString().padStart(2, "0")}`);
      nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() + 1);
    }

    return months;
  }

  async getApprovedCommissions(affiliate_id: number) {
    const subQuery = await this.orderRepository
      .createQueryBuilder("order")
      .select('DATE_FORMAT(order.created_at, "%Y-%m")', "month")
      .addSelect("SUM(order.commission)", "total_commission")
      .where("order.affiliate_id = :affiliate_id", { affiliate_id })
      .andWhere("order.created_at >= DATE_SUB(NOW(), INTERVAL 9 MONTH)")
      .groupBy("month")
      .getRawMany();
    const monthsInRange = this.getMonthsFromNowTill9MonthsBack();
    const result = monthsInRange.reduce((acc, curr) => {
      acc[curr] = "0.00";
      return acc;
    }, {});

    for (let i = 0; i < subQuery.length; i++) {
      result[subQuery[i].month] = subQuery[i].total_commission;
    }

    const customMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (const key in result) {
      result[customMonths[parseInt(key.split("-")[1]) - 1]] = result[key];
      delete result[key];
    }

    return result;
  }

  async importPaidRecords(file) {
    const { buffer } = file._readableState;
    const readableStream = Readable.from(buffer);
    const rows: any[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        readableStream
          .pipe(parse({ delimiter: ",", ignoreEmpty: true, headers: true }))
          .on("data", (row) => {
            rows.push(row);
          })
          .on("end", () => {
            this.logger.log("CSV parsing completed");
            resolve();
          })
          .on("error", (error) => {
            this.logger.log("Error parsing CSV: %error", error);
            reject(error);
          });
      });
      for (const row of rows) {
        const singleOrder = await this.findSingleOrder(row["Order Number"]);
        if (singleOrder && singleOrder.commission_status === CommissionStatusEnum.APPROVED && singleOrder.commission_payment_status === CommissionPaymentStatusEnum.UNPAID) {
          await this.payoutService.createPayout({ order_id: singleOrder.id, affiliate_id: singleOrder.affiliate_id });
        }
      }
      return await this.orderRepository
        .createQueryBuilder()
        .update(Orders)
        .set(
          rows.reduce((acc, row) => {
            acc["commission_payment_status"] = CommissionPaymentStatusEnum.PAID;
            return acc;
          }, {})
        )
        .where(`order_id IN (:orderIds) AND commission_status = "${CommissionStatusEnum.APPROVED}"`, { orderIds: rows.map((row) => row["Order Number"]) })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async totalSalesStats(affiliate_id?: number, start_date?: string, end_date?: string) {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .select("IFNULL(SUM(order.total_amount), 0)", "total")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'pending' THEN order.total_amount ELSE 0 END), 0)", "pending")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'declined' THEN order.total_amount ELSE 0 END), 0)", "declined")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'approved' THEN order.total_amount ELSE 0 END), 0)", "approved");

    if (affiliate_id) {
      query.where("order.affiliate_id = :affiliate_id", { affiliate_id });
    }

    if (start_date && end_date) {
      query.andWhere("DATE(order.created_at) >= :start_date AND DATE(order.created_at) <= :end_date", {
        start_date,
        end_date,
      });
    }

    return query.getRawOne();
  }

  async totalSalesCountStats(affiliate_id?: number, start_date?: string, end_date?: string) {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .select("IFNULL(COUNT(*), 0)", "total")
      .addSelect("IFNULL(COUNT(CASE WHEN order.commission_status = 'pending' THEN 1 ELSE NULL END), 0)", "pending")
      .addSelect("IFNULL(COUNT(CASE WHEN order.commission_status = 'declined' THEN 1 ELSE NULL END), 0)", "declined")
      .addSelect("IFNULL(COUNT(CASE WHEN order.commission_status = 'approved' THEN 1 ELSE NULL END), 0)", "approved");

    if (affiliate_id) {
      query.where("order.affiliate_id = :affiliate_id", { affiliate_id });
    }

    if (start_date && end_date) {
      query.andWhere("DATE(order.created_at) >= :start_date AND DATE(order.created_at) <= :end_date", {
        start_date,
        end_date,
      });
    }

    return query.getRawOne();
  }

  async commissionsStats(affiliate_id?: number, start_date?: string, end_date?: string) {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .select("IFNULL(SUM(order.commission), 0)", "total")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'pending' THEN order.commission ELSE 0 END), 0)", "pending")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'declined' THEN order.commission ELSE 0 END), 0)", "declined")
      .addSelect("IFNULL(SUM(CASE WHEN order.commission_status = 'approved' AND order.commission_payment_status = 'paid' THEN order.commission ELSE 0 END), 0)", "approved_paid")
      .addSelect(
        "IFNULL(SUM(CASE WHEN order.commission_status = 'approved' AND order.commission_payment_status = 'unpaid' THEN order.commission ELSE 0 END), 0)",
        "approved_unpaid"
      );

    if (affiliate_id) {
      query.where("order.affiliate_id = :affiliate_id", { affiliate_id });
    }

    if (start_date && end_date) {
      query.andWhere("DATE(order.created_at) >= :start_date AND DATE(order.created_at) <= :end_date", {
        start_date,
        end_date,
      });
    }

    return query.getRawOne();
  }

  async affiliateAverageCommissions(affiliate_id: number, start_date: string, end_date: string) {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .select("order.commission_status", "status")
      .addSelect("SUM(order.commission)", "total_commission")
      .addSelect("COUNT(order.id)", "order_count")
      .where("order.affiliate_id = :affiliate_id", { affiliate_id });

    if (start_date && end_date) {
      query.andWhere("DATE(order.created_at) >= :start_date AND DATE(order.created_at) <= :end_date", {
        start_date,
        end_date,
      });
    }

    const result = await query.groupBy("order.commission_status").getRawMany();
    // Calculate the average commissions for each status
    const total = result.reduce((acc, val) => acc + parseFloat(val.total_commission) / parseFloat(val.order_count), 0);
    const averages = { pending: 0.0, approved: 0.0, declined: 0.0, total };
    result.forEach((row) => {
      const status = row.status;
      const totalCommission = parseFloat(row.total_commission);
      const orderCount = parseInt(row.order_count);
      averages[status] = orderCount > 0 ? totalCommission / orderCount : 0;
    });

    return averages;
  }

  async getAllOrders(queryOrderDto: OrderQueryDto) {
    const { page, limit, ...conditions } = queryOrderDto;

    const query = this.orderRepository
      .createQueryBuilder("order")
      .select(["`order`.*", "affiliate.id", "affiliate.first_name", "affiliate.last_name"])
      .leftJoin("order.affiliate_id", "affiliate")
      .where(conditions)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const orders = await query.getRawMany();
    const count = await query.getCount();

    const pages = Math.ceil(count / +limit);

    return {
      orders,
      current_page: +page,
      pages,
    };
  }
}
