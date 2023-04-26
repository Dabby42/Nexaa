import { Injectable, Logger } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import consumer from "konga-amqp-consumer";
import { config } from "../config/config";

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger("RabbitmqService");
  private readonly additionalConfig;
  private readonly messageVersion;
  private readonly queue: any;
  private readonly binding: any;
  private readonly schema: any;
  private consumer: any;

  constructor(private ordersService: OrdersService) {
    this.consumer = consumer;
    this.queue = {
      name: config.amqp.consumers.order_split.queueName,
      prefetch: config.amqp.consumers.order_split.prefetch,
    };

    this.binding = {
      exchangeName: config.amqp.consumers.order_split.exchangeName,
      routingKey: config.amqp.consumers.order_split.routingKey,
    };

    this.schema = {};

    this.additionalConfig = {
      logger: this.logger,
    };

    this.messageVersion = "1.0.0";
  }

  async consumeMessage() {
    const handler = async (message, possibleRedelivery, messageId, callback) => {
      this.logger.log("Handling Split Customer Order for messageId: %s", messageId);
      this.ordersService.create(message);
      callback();
    };

    const consumer = this.consumer.create(config.amqp.connection, this.queue, this.binding, this.messageVersion, handler, this.schema, this.additionalConfig);
    consumer.start();
  }
}
