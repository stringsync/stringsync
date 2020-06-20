import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagsTable1592688390349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE tags;`);
  }
}
