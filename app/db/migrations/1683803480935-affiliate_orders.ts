import { MigrationInterface, QueryRunner } from "typeorm";

export class AffiliateOrders1683803480935 implements MigrationInterface {
  name = "AffiliateOrders1683803480935";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`affiliate_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`affiliate_id\` int NOT NULL, \`order_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`affiliate_orders\``);
  }
}
