import { MigrationInterface, QueryRunner } from "typeorm";

export class OrdersUpdate1688724855003 implements MigrationInterface {
    name = 'OrdersUpdate1688724855003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`return_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`commission_payment_status\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission_payment_status\` enum ('2', '1', '0') NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`return_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`commission\` int NOT NULL`);
    }

}
