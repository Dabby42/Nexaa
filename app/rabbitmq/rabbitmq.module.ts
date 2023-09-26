import { forwardRef, Module, Logger } from "@nestjs/common";
import { RabbitmqService } from "./rabbitmq.service";
import { OrdersModule } from "../orders/orders.module";
import { LinksModule } from "../links/links.module";
import { config } from "../config/config";
import { CategoriesModule } from "../categories/categories.module";
import { UserModule } from "../user/user.module";

@Module({
  providers: [
    {
      provide: "RABBITMQ_CONNECTION",
      useFactory: async () => {
        const amqp = await import("amqplib");
        try {
          return await amqp.connect(config.amqp.connection);
        } catch (e) {
          const logger = new Logger("RabbitMQ");
          logger.error("Unable to connect rabbitMQ server.");
        }
      },
    },
    RabbitmqService,
  ],
  imports: [OrdersModule, forwardRef(() => LinksModule), CategoriesModule, forwardRef(() => UserModule)],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
