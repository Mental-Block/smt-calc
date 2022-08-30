import {MigrationInterface, QueryRunner} from "typeorm";

export class runMigration1660925387890 implements MigrationInterface {
    name = 'runMigration1660925387890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d" FOREIGN KEY ("mslId") REFERENCES "floorlife"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d" FOREIGN KEY ("mslId") REFERENCES "floorlife"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

}
