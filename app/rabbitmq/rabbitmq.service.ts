import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { config } from "../config/config";
import { Connection } from "amqplib";
import { LinksService } from "../links/links.service";

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private readonly logger = new Logger("RabbitmqService");

  constructor(
    private ordersService: OrdersService,
    @Inject(forwardRef(() => LinksService)) private linkService: LinksService,
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
        const message = JSON.parse(msg.content.toString());
        this.logger.debug("Handling Split Customer Order for message : " + JSON.stringify(message));
        await this.ordersService.createOrder(message);
        channel.ack(msg);
        this.logger.debug("Done handling Split Customer Order for message : " + JSON.stringify(message));
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
}
