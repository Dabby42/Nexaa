import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFeOrderSyncEntity1690806386150 implements MigrationInterface {
  name = "UpdateFeOrderSyncEntity1690806386150";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`affiliate_orders\` DROP COLUMN \`order_id\``);
    await queryRunner.query(`ALTER TABLE \`affiliate_orders\` ADD \`order_id\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`affiliate_orders\` DROP COLUMN \`order_id\``);
    await queryRunner.query(`ALTER TABLE \`affiliate_orders\` ADD \`order_id\` int NOT NULL`);
  }
}
