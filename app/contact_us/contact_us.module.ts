import { Module } from "@nestjs/common";
import { ContactUsController } from "./contact_us.controller";
import { NotificationModule } from "../notification/notification.module";

@Module({
  controllers: [ContactUsController],
  imports: [NotificationModule],
})
export class ContactUsModule {}
