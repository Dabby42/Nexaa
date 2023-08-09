import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { config } from "../config/config";
import { Connection } from "amqplib";
import { LinksService } from "../links/links.service";
import { CategoriesService } from "../categories/categories.service";
import { UserService } from "../user/user.service";
import { MagentoOrderDto } from "./dto/magento-order.dto";
import { validate } from "class-validator";
import { CreateOrderDto } from "../orders/dto/create-order.dto";

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private readonly logger = new Logger("RabbitmqService");

  constructor(
    private ordersService: OrdersService,
    @Inject(forwardRef(() => LinksService)) private linkService: LinksService,
    private readonly categoryService: CategoriesService,
    private readonly userService: UserService,
    @Inject("RABBITMQ_CONNECTION") private readonly connection: Connection
  ) {}

  onModuleInit(): any {
    this.consumeClickedLinkMessage();
    this.consumeOrderMessage();
  }

  async consumeOrderMessage() {
    if (this.connection) {
      const channel = await this.connection.createChannel();
      await channel.assertQueue(config.amqp.consumers.order_sync.queueName);
      const handler = async (msg) => {
        try {
          const message = JSON.parse(msg.content.toString());
          const messageData = new MagentoOrderDto();
          Object.assign(messageData, message);
          const validationError = await validate(messageData, { whitelist: true });
          if (validationError.length) {
            this.logger.debug("Skipping handling message, invalid message schema " + JSON.stringify(message));
            channel.ack(msg);
            return;
          }
          this.logger.debug("Handling Affiliate Order for message : " + JSON.stringify(message));
          await this.handleMagentoOrder(messageData);
          channel.ack(msg);
          this.logger.debug("Done handling Affiliate Order for message : " + JSON.stringify(message));
        } catch (e) {
          this.logger.error("Error while handling order message " + msg.content.toString() + " with error " + e.message);
          channel.ack(msg);
        }
      };
      channel.consume(config.amqp.consumers.order_sync.queueName, handler);
    }
  }

  async publishClickMessage(message) {
    try {
      const channel = await this.connection.createChannel();
      channel.sendToQueue(config.amqp.consumers.clicked_link.queueName, Buffer.from(JSON.stringify(message)));
    } catch (err) {
      this.logger.error("Unable to publish click message : " + JSON.stringify(message) + " with error " + err.message);
    }
  }

  async consumeClickedLinkMessage() {
    if (this.connection) {
      const channel = await this.connection.createChannel();
      await channel.assertQueue(config.amqp.consumers.clicked_link.queueName);
      const handler = async (msg) => {
        const message = JSON.parse(msg.content.toString());
        this.logger.debug("Handling clicked link with message: " + JSON.stringify(message));
        await this.linkService.registerClick(message);
        channel.ack(msg);
        this.logger.debug("Done handling clicked link with message: " + JSON.stringify(message));
      };

      channel.consume(config.amqp.consumers.clicked_link.queueName, handler);
    }
  }

  async handleMagentoOrder(data: MagentoOrderDto) {
    let commission = 0.0;
    let total_amount = 0;
    const categories = [];
    for (const item of data.orderItems) {
      const commData = await this.categoryService.getCommissionFromCategoryIds(item.categoryIds);
      commission += (+commData[0] / 100) * (parseFloat(item.price) * item.qty);
      categories.push(commData[1]);
      total_amount += parseFloat(item.price);
    }

    const affiliate = await this.userService.findByUsername(data.affiliate);
    if (!affiliate) throw new Error("Affiliate with username " + data.affiliate + " not found.");

    const orderData: CreateOrderDto = {
      order_id: data.id,
      status: data.state,
      commission,
      total_amount,
      affiliate_id: affiliate.id,
      product_id: +data.orderItems[0].sku,
      category: categories.join(),
    };

    await this.ordersService.createOrder(orderData);
  }
}
