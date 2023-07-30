import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLinkEntity1688982578596 implements MigrationInterface {
  name = "UpdateLinkEntity1688982578596";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` ADD \`banner_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`links\` ADD CONSTRAINT \`FK_a7ad6f35c7202532579ce96fcd0\` FOREIGN KEY (\`banner_id\`) REFERENCES \`banner\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_a7ad6f35c7202532579ce96fcd0\``);
    await queryRunner.query(`ALTER TABLE \`links\` DROP COLUMN \`banner_id\``);
  }
}
