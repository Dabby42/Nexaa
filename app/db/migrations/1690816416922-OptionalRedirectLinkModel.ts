import { MigrationInterface, QueryRunner } from "typeorm";

export class OptionalRedirectLinkModel1690816416922 implements MigrationInterface {
  name = "OptionalRedirectLinkModel1690816416922";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` CHANGE \`redirect_url\` \`redirect_url\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`links\` CHANGE \`redirect_url\` \`redirect_url\` varchar(255) NOT NULL`);
  }
}
