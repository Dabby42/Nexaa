import { MigrationInterface, QueryRunner } from "typeorm";

export class ClickLinkAndIpMigrations1681297288554 implements MigrationInterface {
  name = "ClickLinkAndIpMigrations1681297288554";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`links\` (\`id\` int NOT NULL AUTO_INCREMENT, \`redirect_url\` varchar(255) NOT NULL, \`k_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`ips\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ip_address\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`link_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`clicks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`unique_count\` int NOT NULL, \`count\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`link_id\` int NULL, \`ip_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`links\` ADD CONSTRAINT \`FK_9f8dea86e48a7216c4f5369c1e4\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`ips\` ADD CONSTRAINT \`FK_8f3d2cd76a934c52d964bb00800\` FOREIGN KEY (\`link_id\`) REFERENCES \`links\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`clicks\` ADD CONSTRAINT \`FK_3e477bfbdf3a572363b65bc4525\` FOREIGN KEY (\`link_id\`) REFERENCES \`links\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`clicks\` ADD CONSTRAINT \`FK_2944d8e171fd5fc51af34423332\` FOREIGN KEY (\`ip_id\`) REFERENCES \`ips\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP FOREIGN KEY \`FK_2944d8e171fd5fc51af34423332\``);
    await queryRunner.query(`ALTER TABLE \`clicks\` DROP FOREIGN KEY \`FK_3e477bfbdf3a572363b65bc4525\``);
    await queryRunner.query(`ALTER TABLE \`ips\` DROP FOREIGN KEY \`FK_8f3d2cd76a934c52d964bb00800\``);
    await queryRunner.query(`ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_9f8dea86e48a7216c4f5369c1e4\``);
    await queryRunner.query(`DROP TABLE \`clicks\``);
    await queryRunner.query(`DROP TABLE \`ips\``);
    await queryRunner.query(`DROP TABLE \`links\``);
  }
}
