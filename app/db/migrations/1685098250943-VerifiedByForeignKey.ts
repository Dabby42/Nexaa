import { MigrationInterface, QueryRunner } from "typeorm";

export class VerifiedByForeignKey1685098250943 implements MigrationInterface {
  name = "VerifiedByForeignKey1685098250943";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9e81c7fa8904b4eee3392e67752\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9e81c7fa8904b4eee3392e67752\` FOREIGN KEY (\`verified_by\`) REFERENCES \`admins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9e81c7fa8904b4eee3392e67752\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9e81c7fa8904b4eee3392e67752\` FOREIGN KEY (\`verified_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
