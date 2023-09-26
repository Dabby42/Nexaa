import { MigrationInterface, QueryRunner } from "typeorm";

export class MagentoCategoryMap1691591264086 implements MigrationInterface {
  name = "MagentoCategoryMap1691591264086";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` ADD \`magento_id\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`magento_id\``);
  }
}
