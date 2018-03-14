# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180314043147) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "notations", force: :cascade do |t|
    t.string   "song_name",                                null: false
    t.string   "artist_name",                              null: false
    t.text     "vextab_string",                            null: false
    t.integer  "dead_time_ms",           default: 1
    t.integer  "transcriber_id",                           null: false
    t.decimal  "duration_ms",            default: "1.0",   null: false
    t.decimal  "bpm",                    default: "120.0"
    t.boolean  "featured",               default: false
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.string   "thumbnail_file_name"
    t.string   "thumbnail_content_type"
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
  end

  create_table "taggings", force: :cascade do |t|
    t.integer "notation_id", null: false
    t.integer "tag_id",      null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
  end

end
