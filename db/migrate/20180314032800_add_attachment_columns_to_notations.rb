class AddAttachmentColumnsToNotations < ActiveRecord::Migration[5.0]
  def change
    add_attachment :notations, :thumbnail
  end
end
