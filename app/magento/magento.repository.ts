import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { createConnection } from "typeorm";

@Injectable()
export class MagentoRepository {
  private static connection;

  private async magentoDataBaseConnection() {
    if (!MagentoRepository.connection) {
      MagentoRepository.connection = await createConnection("magento");
    }
    return MagentoRepository.connection;
  }

  async getOrder(orderIds: any[]) {
    let orderDetails: any;

    try {
      await this.magentoDataBaseConnection();
      const parameters: string = orderIds.join(",");
      const queryString = `SELECT entity_id, status FROM sales_flat_order WHERE entity_id IN (${parameters})`;
      const entityManager = MagentoRepository.connection.manager;
      orderDetails = await entityManager.query(queryString);
      if (orderDetails.length === 0) {
        throw new NotFoundException(`Order Not found`);
      }
      return orderDetails;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
