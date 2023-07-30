import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerEntityUpdate1688725404266 implements MigrationInterface {
  name = "BannerEntityUpdate1688725404266";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_description\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_code\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`campaign_start_date\` datetime NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`campaign_end_date\` datetime NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`campaign_end_date\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`campaign_start_date\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_code\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_description\``);
  }
}
