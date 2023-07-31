import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerAndNewsUpdates1690837609764 implements MigrationInterface {
  name = "BannerAndNewsUpdates1690837609764";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_49778e3487e0aae77d1e75fb2e9\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`commission\``);
    await queryRunner.query(`ALTER TABLE \`banner\` DROP COLUMN \`banner_code\``);
    await queryRunner.query(`ALTER TABLE \`banner\` CHANGE \`status\` \`status\` enum ('1', '2', '3') NOT NULL DEFAULT '1'`);
    await queryRunner.query(
      `ALTER TABLE \`news\` ADD CONSTRAINT \`FK_49778e3487e0aae77d1e75fb2e9\` FOREIGN KEY (\`publisher_id\`) REFERENCES \`admins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_49778e3487e0aae77d1e75fb2e9\``);
    await queryRunner.query(`ALTER TABLE \`banner\` CHANGE \`status\` \`status\` enum ('1', '2') NOT NULL DEFAULT '1'`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`banner_code\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`banner\` ADD \`commission\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`news\` ADD CONSTRAINT \`FK_49778e3487e0aae77d1e75fb2e9\` FOREIGN KEY (\`publisher_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
