import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderMigrations1686651079110 implements MigrationInterface {
  name = "UpdateOrderMigrations1686651079110";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total_amount\` \`total_amount\` decimal(10,2) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total_amount\` \`total_amount\` decimal(2,1) NOT NULL`);
  }
}
