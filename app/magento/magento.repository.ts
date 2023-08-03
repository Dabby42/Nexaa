import { BadRequestException, Injectable } from "@nestjs/common";
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
      const queryString = `SELECT increment_id, state FROM sales_flat_order WHERE increment_id IN (${orderIds})`;
      if (!this.conn) {
        this.conn = await this.connection();
      }
      orderDetails = await this.conn.query(queryString);
      return orderDetails;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
