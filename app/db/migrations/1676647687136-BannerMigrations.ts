import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerMigrations1676647687136 implements MigrationInterface {
  name = "BannerMigrations1676647687136";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`banner\` (\`id\` int NOT NULL AUTO_INCREMENT, \`banner_name\` varchar(255) NOT NULL, \`banner_images_and_sizes\` varchar(255) NOT NULL, \`banner_link\` varchar(255) NOT NULL, \`tracking_tag\` varchar(255) NULL, \`status\` enum ('1', '2') NOT NULL DEFAULT '1', \`commission\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`banner\``);
  }
}
