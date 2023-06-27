import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MagentoRepository } from "../magento/magento.repository";
import { parse } from "@fast-csv/parse";
import { Readable } from "stream";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger("OrderService");

  constructor(@InjectRepository(Orders) private orderRepository: Repository<Orders>, private readonly magentoRepository: MagentoRepository) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateOrderStatus() {
    const statusArr = ["cancelled", "new"];
    const orderIds = await this.orderRepository.createQueryBuilder().select("order_id").where("status IS IN (:...statusArr)", { statusArr }).getMany();
    const orderDetails = await this.magentoRepository.getOrder(orderIds);
    await this.orderRepository
      .createQueryBuilder()
      .update(Orders)
      .set(
        orderDetails.reduce((acc, order) => {
          acc["status"] = order.status;
          return acc;
        }, {})
      )
      .whereInIds(orderDetails.map((order) => order.entity_id))
      .execute();

    this.logger.log(
      "Order Status Updated Successfully for orderIds: %ids",
      orderDetails.map((order) => order.entity_id)
    );
  }

  async findAllOrders() {
    return await this.orderRepository.find();
  }

  async getCommissionStats() {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.commission)", "totalCommissions")
      .addSelect("SUM(order.total_amount)", "totalSales")
      .addSelect("SUM(CASE WHEN order.commission_payment_status='1' THEN order.commission ELSE NULL END )", "pendingCommissions")
      .addSelect("SUM(CASE WHEN order.commission_payment_status='0' THEN order.commission ELSE NULL END )", "unpaidCommissions")
      .getRawOne();
  }

  async findSingleOrder(id: number) {
    return await this.orderRepository.findOne({ where: { id } });
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
      return await this.orderRepository
        .createQueryBuilder()
        .update(Orders)
        .set(
          rows.reduce((acc, row) => {
            acc["status"] = row.status;
            return acc;
          }, {})
        )
        .where("order_id IN (:orderIds)", { orderIds: rows.map((row) => row.id) })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
