import { MigrationInterface, QueryRunner } from "typeorm";

export class newsInit1678793954663 implements MigrationInterface {
    name = 'newsInit1678793954663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`news\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(120) NOT NULL, \`body\` varchar(500) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publisher_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_49778e3487e0aae77d1e75fb2e9\` FOREIGN KEY (\`publisher_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_49778e3487e0aae77d1e75fb2e9\``);
        await queryRunner.query(`DROP TABLE \`news\``);
    }

}
