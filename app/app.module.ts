import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "./db/data-source";
import { AuthModule } from "./auth/auth.module";
import { WorkModule } from "./work/work.module";
import { AdsModule } from "./ads/ads.module";

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule, AuthModule, WorkModule, AdsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
