import { MigrationInterface, QueryRunner } from "typeorm";

export class PayoutTable1690730781455 implements MigrationInterface {
  name = "PayoutTable1690730781455";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payout\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int NULL, \`affiliate_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`payout\` ADD CONSTRAINT \`FK_b8871a008d488ac0065baff70f8\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`payout\` ADD CONSTRAINT \`FK_5d61884e28e3718cb719d5a947c\` FOREIGN KEY (\`affiliate_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`payout\` DROP FOREIGN KEY \`FK_5d61884e28e3718cb719d5a947c\``);
    await queryRunner.query(`ALTER TABLE \`payout\` DROP FOREIGN KEY \`FK_b8871a008d488ac0065baff70f8\``);
    await queryRunner.query(`DROP TABLE \`payout\``);
  }
}
