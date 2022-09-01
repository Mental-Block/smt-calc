import {MigrationInterface, QueryRunner} from "typeorm";

export class runMigration1662070931942 implements MigrationInterface {
    name = 'runMigration1662070931942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" text NOT NULL,
                "password" text NOT NULL,
                "role" text NOT NULL,
                "tokenVersion" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "bakecomponent" (
                "id" SERIAL NOT NULL,
                "userId" integer,
                CONSTRAINT "PK_e998761fea3ba1be9c8ec81d4e1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "floorlife" (
                "id" SERIAL NOT NULL,
                "level" text NOT NULL,
                "status" text NOT NULL DEFAULT 'PAUSED',
                "availableAt" TIMESTAMP WITH TIME ZONE,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "labelId" integer,
                CONSTRAINT "REL_2f9acd2f69af37cfd246d6fc03" UNIQUE ("labelId"),
                CONSTRAINT "PK_1f0efe04df28f87fc93ec8db418" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "label" (
                "id" SERIAL NOT NULL,
                "partId" bigint NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "componentId" integer,
                CONSTRAINT "UQ_b038f635dad70670657c0dd77bf" UNIQUE ("partId"),
                CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "component" (
                "id" SERIAL NOT NULL,
                "partnumberInternal" character varying NOT NULL,
                "partnumberManufactor" character varying NOT NULL,
                "packageType" character varying array NOT NULL DEFAULT '{}',
                "vendor" character varying NOT NULL,
                "name" character varying NOT NULL,
                "bodyThickness" double precision NOT NULL,
                "pinCount" integer NOT NULL,
                "description" text,
                "mslLevel" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_1346955ce67fe81654919148b25" UNIQUE ("partnumberManufactor"),
                CONSTRAINT "PK_c084eba2d3b157314de79135f09" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "componentname" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_34b7eebc199c9fc0c03aaa52c6b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "settings" (
                "id" SERIAL NOT NULL,
                "humidity" integer NOT NULL,
                "tempature" integer NOT NULL,
                "updateAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "bakecomponent"
            ADD CONSTRAINT "FK_e79a8e5297ea707e2b52122519f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "floorlife"
            ADD CONSTRAINT "FK_2f9acd2f69af37cfd246d6fc03f" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "label"
            ADD CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995" FOREIGN KEY ("componentId") REFERENCES "component"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            INSERT INTO users(username,password,role) VALUES('admin', '$2a$10$8uWJo5tfSx05k/eZHlb1t./1OAIyZTQH91j/e1nCs0WxpCsCshgby', 'admin');
            INSERT INTO settings(humidity,tempature) VALUES('60', '30');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "label" DROP CONSTRAINT "FK_f74d21dfcc3ab6df147c485d995"
        `);
        await queryRunner.query(`
            ALTER TABLE "floorlife" DROP CONSTRAINT "FK_2f9acd2f69af37cfd246d6fc03f"
        `);
        await queryRunner.query(`
            ALTER TABLE "bakecomponent" DROP CONSTRAINT "FK_e79a8e5297ea707e2b52122519f"
        `);
        await queryRunner.query(`
            DROP TABLE "settings"
        `);
        await queryRunner.query(`
            DROP TABLE "componentname"
        `);
        await queryRunner.query(`
            DROP TABLE "component"
        `);
        await queryRunner.query(`
            DROP TABLE "label"
        `);
        await queryRunner.query(`
            DROP TABLE "floorlife"
        `);
        await queryRunner.query(`
            DROP TABLE "bakecomponent"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
