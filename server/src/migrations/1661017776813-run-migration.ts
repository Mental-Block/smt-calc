import {MigrationInterface, QueryRunner} from "typeorm";

export class runMigration1661017776813 implements MigrationInterface {
    name = 'runMigration1661017776813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "REL_d719c8edaf77ac62f47529a4d1"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP COLUMN "mslId"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife"
            ADD "labelId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife"
            ADD CONSTRAINT "UQ_2f9acd2f69af37cfd246d6fc03f" UNIQUE ("labelId")
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife"
            ADD CONSTRAINT "FK_2f9acd2f69af37cfd246d6fc03f" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995" FOREIGN KEY ("componentId") REFERENCES "component"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."label" DROP CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife" DROP CONSTRAINT "FK_2f9acd2f69af37cfd246d6fc03f"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife" DROP CONSTRAINT "UQ_2f9acd2f69af37cfd246d6fc03f"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."floorlife" DROP COLUMN "labelId"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD "mslId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "REL_d719c8edaf77ac62f47529a4d1" UNIQUE ("mslId")
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995" FOREIGN KEY ("componentId") REFERENCES "component"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."label"
            ADD CONSTRAINT "FK_d719c8edaf77ac62f47529a4d1d" FOREIGN KEY ("mslId") REFERENCES "floorlife"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
