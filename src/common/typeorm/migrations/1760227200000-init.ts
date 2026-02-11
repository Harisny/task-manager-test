import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1760227200000 implements MigrationInterface {
  name = 'Init1760227200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(
      "CREATE TYPE \"task_status_enum\" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE')",
    );
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")',
    );
    await queryRunner.query(
      'CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying(1000), "status" "task_status_enum" NOT NULL DEFAULT \'OPEN\', "userId" uuid NOT NULL, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "tasks" ADD CONSTRAINT "FK_tasks_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_user"',
    );
    await queryRunner.query('DROP TABLE "tasks"');
    await queryRunner.query('DROP INDEX "IDX_users_email"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "task_status_enum"');
  }
}
