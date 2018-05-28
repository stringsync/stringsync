class UpdateEmailIndexOnUsers < ActiveRecord::Migration[5.0]
  def change
    remove_index :users, :email
    add_index :users, %i(email provider)
  end
end
