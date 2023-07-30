import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderMigration1686921131076 implements MigrationInterface {
  name = "UpdateOrderMigration1686921131076";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_id\` \`affiliate_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_2ab5ec884bf5e2a23e2c6584f53\` FOREIGN KEY (\`affiliate_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_2ab5ec884bf5e2a23e2c6584f53\``);
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`affiliate_id\` \`user_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
