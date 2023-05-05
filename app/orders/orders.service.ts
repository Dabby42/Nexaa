import { Injectable, Logger } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "./entities/order.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MagentoRepository } from "../magento/magento.repository";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger("OrderService");

  constructor(@InjectRepository(Orders) private orderRepository: Repository<Orders>, private readonly magentoRepository: MagentoRepository) {}

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateOrderStatus() {
    const orderDetails = await this.magentoRepository.getOrderStatus();
    await this.orderRepository
      .createQueryBuilder()
      .update(Orders)
      .set(
        orderDetails.reduce((acc, order) => {
          acc[order.entity_id] = order.status;
          return acc;
        }, {})
      )
      .whereInIds(orderDetails.map((order) => order.entity_id))
      .execute();

    await this.magentoRepository.updateOrderSyncStatus(orderDetails.map((order) => order.entity_id));
    this.logger.log(
      "Order Status Updated Successfully for orderIds: %ids",
      orderDetails.map((order) => order.entity_id)
    );
  }

  async findAllOrders() {
    return await this.orderRepository.find();
  }

  async findSingleOrder(id: number) {
    return await this.orderRepository.findOne({ where: { id } });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
