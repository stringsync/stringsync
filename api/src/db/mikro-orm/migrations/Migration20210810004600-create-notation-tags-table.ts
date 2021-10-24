import { Migration } from '@mikro-orm/migrations';

export class Migration20210810004600 extends Migration {
  async up(): Promise<void> {
    await this.execute(`
CREATE TABLE notation_tags (
  id TEXT PRIMARY KEY,
  notation_id TEXT REFERENCES notations (id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags (id) ON DELETE CASCADE,
  UNIQUE (notation_id, tag_id)
);

CREATE TRIGGER trigger_generate_tagging_id BEFORE INSERT ON notation_tags FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
CREATE INDEX index_notation_tags_on_notation_id ON notation_tags (notation_id);
CREATE INDEX index_notation_tags_on_tag_id ON notation_tags (tag_id);
CREATE INDEX index_notation_tags_on_notation_id_and_tag_id ON notation_tags (notation_id, tag_id);`);
  }

  async down(): Promise<void> {
    await this.execute(`
DROP TABLE notation_tags;
  
DROP TRIGGER trigger_generate_tagging_id;
DROP INDEX index_notation_tags_on_notation_id;
DROP INDEX index_notation_tags_on_tag_id;
DROP INDEX index_notation_tags_on_notation_id_and_tag_id;`);
  }
}
