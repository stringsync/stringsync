class CreateNotations < ActiveRecord::Migration[5.0]
  def change
    create_table :notations do |t|
      t.string :song_name, null: false
      t.string :artist_name, null: false
      t.text :vextab_string, null: false
      t.integer :dead_time_ms, default: 1
      t.integer :transcriber_id, null: false
      t.decimal :duration_ms, null: false, default: 1.0
      t.decimal :bpm, default: 120.0
      t.boolean :featured, default: false

      t.timestamps
    end
  end
end
