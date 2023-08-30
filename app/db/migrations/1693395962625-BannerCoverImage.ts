import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerCoverImage1693395962625 implements MigrationInterface {
  name = "BannerCoverImage1693395962625";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`cover_image\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`cover_image\``);
  }
}
