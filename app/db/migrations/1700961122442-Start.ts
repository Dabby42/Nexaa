import { MigrationInterface, QueryRunner } from "typeorm";

export class Start1700961122442 implements MigrationInterface {
  name = "Start1675175773271";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`role\` enum ('1', '2') NOT NULL DEFAULT '1', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`basic_auth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL ,PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
        'ALTER TABLE `basic_auth` ADD CONSTRAINT `FK_45fdef50616d8364be025a09b1d` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `basic_auth` DROP FOREIGN KEY `FK_45fdef50616d8364be025a09b1d`");
    await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`basic_auth\``);
  }
}
