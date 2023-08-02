import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBanner1690899999928 implements MigrationInterface {
  name = "UpdateBanner1690899999928";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` CHANGE \`status\` \`status\` enum ('active', 'disabled', 'paused') NOT NULL DEFAULT 'active'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`banner\` CHANGE \`status\` \`status\` enum ('1', '2', '3') NOT NULL DEFAULT '1'`);
  }
}
