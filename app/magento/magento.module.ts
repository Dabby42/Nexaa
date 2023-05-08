import { Module } from "@nestjs/common";
import { MagentoRepository } from "./magento.repository";

@Module({
  providers: [MagentoRepository],
  exports: [MagentoRepository],
})
export class MagentoModule {}
