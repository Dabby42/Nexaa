import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderTableMigrations1686316616893 implements MigrationInterface {
  name = "UpdateOrderTableMigrations1686316616893";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`return_id\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission_payment_status\` enum ('2', '1', '0') NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_id\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_id\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_id\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission_payment_status\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`return_id\``);
  }
}
