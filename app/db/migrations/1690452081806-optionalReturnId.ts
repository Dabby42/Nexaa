import { MigrationInterface, QueryRunner } from "typeorm";

export class OptionalReturnId1690452081806 implements MigrationInterface {
    name = 'OptionalReturnId1690452081806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`return_id\` \`return_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`return_id\` \`return_id\` varchar(255) NOT NULL`);
    }

}
