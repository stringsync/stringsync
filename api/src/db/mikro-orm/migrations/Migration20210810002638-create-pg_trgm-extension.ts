import { Migration } from '@mikro-orm/migrations';

export class Migration20210810002638 extends Migration {
  async up(): Promise<void> {
    await this.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm";');
  }

  async down(): Promise<void> {
    await this.execute('DROP EXTENSION "pg_trgm";');
  }
}
