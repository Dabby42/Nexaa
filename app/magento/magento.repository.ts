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

  async getOrderStatus() {
    let orderDetails: any;

    try {
      await this.magentoDataBaseConnection();
      const queryString = "SELECT entity_id, status FROM sales_flat_order WHERE aff_sync = 0";
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

  async updateOrderSyncStatus(orderIds: number[]) {
    try {
      await this.magentoDataBaseConnection();
      const parameters: string = orderIds.join(",");
      const queryString = `UPDATE sales_flat_order SET aff_sync = 1 WHERE entity_id IN (${parameters})`;
      const entityManager = MagentoRepository.connection.manager;
      await entityManager.query(queryString);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
