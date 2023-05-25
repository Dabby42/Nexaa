import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClickMigrations1681735514498 implements MigrationInterface {
  name = "UpdateClickMigrations1681735514498";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP FOREIGN KEY \`FK_2944d8e171fd5fc51af34423332\``);
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP COLUMN \`ip_id\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clicks\` ADD \`ip_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`clicks\` ADD CONSTRAINT \`FK_2944d8e171fd5fc51af34423332\` FOREIGN KEY (\`ip_id\`) REFERENCES \`ips\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
