import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentAndCommissionStatus1690280117185 implements MigrationInterface {
  name = "AddPaymentAndCommissionStatus1690280117185";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission_status\` enum ('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending'`);
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`commission_payment_status\` \`commission_payment_status\` enum ('unpaid', 'paid') NOT NULL DEFAULT 'unpaid'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`commission_payment_status\` \`commission_payment_status\` enum ('2', '1', '0') NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission_status\``);
  }
}
