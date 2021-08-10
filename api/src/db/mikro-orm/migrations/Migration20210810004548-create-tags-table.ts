import { Migration } from '@mikro-orm/migrations';

export class Migration20210810004548 extends Migration {
  async up(): Promise<void> {
    await this.execute(`
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
CREATE TRIGGER trigger_generate_tag_id BEFORE INSERT ON tags FOR EACH ROW EXECUTE PROCEDURE unique_short_id();`);
  }

  async down(): Promise<void> {
    await this.execute(`
DROP TABLE tags;

DROP TRIGGER trigger_generate_tag_id ON tags;
`);
  }
}
