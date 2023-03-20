import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryMigrations1677662809234 implements MigrationInterface {
  name = "CategoryMigrations1677662809234";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`category_name\` varchar(255) NOT NULL, \`commission\` int NOT NULL, \`status\` enum ('1', '2') NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9359e3b1d5e90d7a0fbe3b2807\` (\`category_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_9359e3b1d5e90d7a0fbe3b2807\` ON \`category\``);
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
