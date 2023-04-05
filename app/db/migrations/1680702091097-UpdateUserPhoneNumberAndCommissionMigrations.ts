import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPhoneNumberAndCommissionMigrations1680702091097 implements MigrationInterface {
  name = "UpdateUserPhoneNumberAndCommissionMigrations1680702091097";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_01eea41349b6c9275aec646eee\` (\`phone_number\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_01eea41349b6c9275aec646eee\``);
  }
}
