import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderMigrations1686653309717 implements MigrationInterface {
  name = "UpdateOrderMigrations1686653309717";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission\` decimal(10,2) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission\` varchar(255) NOT NULL`);
  }
}
