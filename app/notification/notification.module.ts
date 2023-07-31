import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { NotificationService } from "./notification.service";

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [HttpModule],
})
export class NotificationModule {}
