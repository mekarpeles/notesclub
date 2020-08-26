class DeleteOldTables < ActiveRecord::Migration[6.0]
  def change
    drop_table :exercises_rooms
    drop_table :rooms_users
    drop_table :rooms
    drop_table :answers
    drop_table :exercises
  end
end
