import { MigrationInterface, QueryRunner } from "typeorm";

export class BankDetailsMigrations1675947361356 implements MigrationInterface {
  name = "BankDetailsMigrations1675947361356";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_number\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_number\``);
  }
}
