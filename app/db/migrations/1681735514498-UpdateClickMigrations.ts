import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClickMigrations1681735514498 implements MigrationInterface {
  name = "UpdateClickMigrations1681735514498";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP FOREIGN KEY \`FK_2944d8e171fd5fc51af34423332\``);
    await queryRunner.query(
      `CREATE TABLE \`admins\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_051db7d37d478a69a7432df147\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP COLUMN \`ip_id\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clicks\` ADD \`ip_id\` int NULL`);
    await queryRunner.query(`DROP INDEX \`IDX_051db7d37d478a69a7432df147\` ON \`admins\``);
    await queryRunner.query(`DROP TABLE \`admins\``);
    await queryRunner.query(
      `ALTER TABLE \`clicks\` ADD CONSTRAINT \`FK_2944d8e171fd5fc51af34423332\` FOREIGN KEY (\`ip_id\`) REFERENCES \`ips\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
