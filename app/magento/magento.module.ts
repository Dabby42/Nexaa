import { Module } from "@nestjs/common";
import { MagentoRepository } from "./magento.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import magentoSource from "../db/magento-source";

@Module({
  providers: [MagentoRepository],
  exports: [MagentoRepository],
  imports: [TypeOrmModule.forFeature([], magentoSource)],
})
export class MagentoModule {}
