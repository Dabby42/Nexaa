import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStateType1679307557039 implements MigrationInterface {
  name = "UpdateStateType1679307557039";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_45fdef50616d8364be025a09b1d\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`state\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`state\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`state\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`state\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_45fdef50616d8364be025a09b1d\` FOREIGN KEY (\`state\`) REFERENCES \`country_region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
