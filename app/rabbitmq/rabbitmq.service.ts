import { Injectable, Logger } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import consumer from "konga-amqp-consumer";
import { config } from "../config/config";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Ips } from "../links/entities/ip.entity";
import { Clicks } from "../links/entities/click.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger("RabbitmqService");
  private readonly additionalConfig = {
    logger: this.logger,
  };
  private readonly messageVersion = "1.0.0";
  private queue: any;
  private binding: any;
  private readonly schema: any = {};
  private readonly consumer: any = consumer;

  constructor(
    private ordersService: OrdersService,
    @InjectRepository(Ips) private ipRepository: Repository<Ips>,
    @InjectRepository(Clicks) private clickRepository: Repository<Clicks>
  ) {}

  async consumeOrderMessage() {
    this.queue = {
      name: config.amqp.consumers.order_split.queueName,
      prefetch: config.amqp.consumers.order_split.prefetch,
    };

    this.binding = {
      exchangeName: config.amqp.consumers.order_split.exchangeName,
      routingKey: config.amqp.consumers.order_split.routingKey,
    };
    const handler = async (message, possibleRedelivery, messageId, callback) => {
      this.logger.log("Handling Split Customer Order for messageId: %s", messageId);
      await this.ordersService.createOrder(message);
      callback();
    };

    const consumer = this.consumer.create(config.amqp.connection, this.queue, this.binding, this.messageVersion, handler, this.schema, this.additionalConfig);
    consumer.start();
  }

  async consumeClickedLinkMessage() {
    this.queue = {
      name: config.amqp.consumers.clicked_link.queueName,
      prefetch: config.amqp.consumers.clicked_link.prefetch,
    };

    this.binding = {
      exchangeName: config.amqp.consumers.clicked_link.exchangeName,
      routingKey: config.amqp.consumers.clicked_link.routingKey,
    };
    const handler = async (message, possibleRedelivery, messageId, callback) => {
      this.logger.log("Handling Single clicked link for messageId: %s", messageId);
      await this.ordersService.createOrder(message);
      const ipAddress = message.req.ip || message.req.headers["x-forwarded-for"] || message.req.socket.remoteAddress;
      const findOptions: FindOneOptions<Ips> = { relations: ["link_id"], where: { ip_address: ipAddress, link_id: { id: message.foundLinkModel.id } } };
      const foundIpAddress = await this.ipRepository.findOne(findOptions);

      if (foundIpAddress) {
        const clickFindOptions: FindOptionsWhere<Clicks> = { link_id: { id: foundIpAddress.link_id.id } };
        const click = await this.clickRepository.findBy(clickFindOptions);
        let existingClickCount = click[0].count;

        const now = new Date();
        const isSameDate =
          click[0].created_at.getFullYear() === now.getFullYear() && click[0].created_at.getMonth() === now.getMonth() && click[0].created_at.getDate() === now.getDate();

        if (isSameDate) {
          existingClickCount++;
          await this.clickRepository.update(
            { link_id: { id: foundIpAddress.link_id.id } },
            {
              count: existingClickCount,
            }
          );
        } else {
          const newClickDetails = {
            link_id: { id: message.foundLinkModel.id },
            unique_count: 1,
            count: 1,
          };
          const newClickInstance = this.clickRepository.create(newClickDetails);
          await this.clickRepository.insert(newClickInstance);
        }
      } else {
        const ipDetails: DeepPartial<Ips> = {
          link_id: { id: message.foundLinkModel.id },
          ip_address: ipAddress,
        };

        const newIpModel = this.ipRepository.create(ipDetails);
        await this.ipRepository.save(newIpModel);

        const click = await this.clickRepository.findOne({ where: { link_id: { id: message.foundLinkModel.id } } });

        if (click) {
          await this.clickRepository.update(
            { link_id: { id: message.foundLinkModel.id } },
            {
              unique_count: click.unique_count + 1,
              count: click.count + 1,
            }
          );
        } else {
          const newClickDetails = {
            link_id: { id: message.foundLinkModel.id },
            unique_count: 1,
            count: 1,
          };
          const newClickModel = this.clickRepository.create(newClickDetails);
          await this.clickRepository.save(newClickModel);
        }
      }
      callback();
    };

    const consumer = this.consumer.create(config.amqp.connection, this.queue, this.binding, this.messageVersion, handler, this.schema, this.additionalConfig);
    consumer.start();
  }
}
