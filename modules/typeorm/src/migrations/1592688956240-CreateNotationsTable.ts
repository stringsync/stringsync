import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotationsTable1592688956240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE notations (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            song_name TEXT NOT NULL,
            artist_name TEXT NOT NULL,
            dead_time_ms integer DEFAULT 0 NOT NULL,
            duration_ms integer DEFAULT 0 NOT NULL,
            bpm decimal DEFAULT 120 NOT NULL,
            featured BOOLEAN default false NOT NULL,
            transcriber_id integer REFERENCES users (id) ON DELETE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE notations;`);
  }
}
