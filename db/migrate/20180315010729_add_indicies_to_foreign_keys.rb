class AddIndiciesToForeignKeys < ActiveRecord::Migration[5.0]
  def change
    add_index :taggings, :tag_id
    add_index :taggings, :notation_id
    add_index :notations, :transcriber_id
  end
end
