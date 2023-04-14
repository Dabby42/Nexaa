import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerImageSizeTypeUpdate1680167994867 implements MigrationInterface {
  name = "BannerImageSizeTypeUpdate1680167994867";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_images_and_sizes\``);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_images_and_sizes\` text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_images_and_sizes\``);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_images_and_sizes\` varchar(255) NOT NULL`);
  }
}
