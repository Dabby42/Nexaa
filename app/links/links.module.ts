import { Module } from "@nestjs/common";
import { LinksService } from "./links.service";
import { LinksController } from "./links.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Links } from "./entities/link.entity";
import { Clicks } from "./entities/click.entity";
import { Ips } from "./entities/ip.entity";

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [TypeOrmModule.forFeature([Links, Clicks, Ips])],
  exports: [LinksService],
})
export class LinksModule {}
