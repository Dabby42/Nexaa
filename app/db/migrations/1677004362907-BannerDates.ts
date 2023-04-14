import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerDates1677004362907 implements MigrationInterface {
  name = "BannerDates1677004362907";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`created_at\``);
  }
}
