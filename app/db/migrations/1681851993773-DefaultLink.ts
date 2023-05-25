import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultLink1681851993773 implements MigrationInterface {
  name = "DefaultLink1681851993773";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` ADD \`is_default\` tinyint NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` DROP COLUMN \`is_default\``);
  }
}
