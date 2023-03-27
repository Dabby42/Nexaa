import { MigrationInterface, QueryRunner } from "typeorm";

export class AffiliateRejectReason1679491857052 implements MigrationInterface {
  name = "AffiliateRejectReason1679491857052";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`disable_reason\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`disable_reason\``);
  }
}
