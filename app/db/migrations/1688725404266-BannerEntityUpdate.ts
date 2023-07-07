import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerEntityUpdate1688725404266 implements MigrationInterface {
  name = "BannerEntityUpdate1688725404266";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_description\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_code\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`campaign_start_date\` datetime NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`campaign_end_date\` datetime NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`affiliate_id\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_2ab5ec884bf5e2a23e2c6584f53\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`affiliate_id\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`campaign_end_date\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`campaign_start_date\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_code\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_description\``);
  }
}
