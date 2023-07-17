import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CustomCacheModule } from "../cache/cache.module";

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [CustomCacheModule],
})
export class NotificationModule {}
