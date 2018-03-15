class CreateVideos < ActiveRecord::Migration[5.0]
  def change
    create_table :videos do |t|
      t.integer :notation_id, null: false
      t.string :src, null: false
    end

    add_index :videos, :notation_id
  end
end
