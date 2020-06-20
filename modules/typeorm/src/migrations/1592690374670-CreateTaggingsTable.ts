import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaggingsTable1592690374670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE taggings (
          id SERIAL PRIMARY KEY,
          notation_id integer REFERENCES notations (id) ON DELETE CASCADE,
          tag_id integer REFERENCES tags (id) ON DELETE CASCADE
      );

      CREATE INDEX index_taggings_on_notation_id ON taggings (notation_id);
      CREATE INDEX index_taggings_on_tag_id ON taggings (tag_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DROP TABLE taggings;
      
      DROP INDEX index_taggings_on_notation_id;
      DROP INDEX index_taggings_on_tag_id;
    `);
  }
}
