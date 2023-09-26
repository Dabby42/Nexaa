import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import magentoDB from "../db/magento-source";

@Injectable()
export class MagentoRepository {
  private conn: EntityManager;

  async connection() {
    const connection = await magentoDB.initialize();

    return connection.manager;
  }

  async getOrder(orderIds: any[]) {
    let orderDetails: any;

    try {
      const queryString = `SELECT increment_id, status FROM sales_flat_order WHERE increment_id IN (${orderIds})`;
      if (!this.conn) {
        this.conn = await this.connection();
      }
      orderDetails = await this.conn.query(queryString);
      if (orderDetails.length === 0) {
        throw new NotFoundException(`Order Not found`);
      }
      return orderDetails;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
