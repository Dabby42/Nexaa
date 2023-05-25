import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1680603457964 implements MigrationInterface {
  name = "UpdateUserTable1680603457964";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_number\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_number\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`category\` ADD \`commission\` decimal(2,1) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`category\` ADD \`commission\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_number\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_number\` int NULL`);
  }
}
