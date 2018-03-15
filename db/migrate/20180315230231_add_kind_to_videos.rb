class AddKindToVideos < ActiveRecord::Migration[5.0]
  def change
    add_column :videos, :kind, :integer, null: false, default: 0
  end
end
