class DeleteOldTables < ActiveRecord::Migration[6.0]
  def change
    drop_table :exercises_rooms if ActiveRecord::Base.connection.table_exists?('exercises_rooms')
    drop_table :rooms_users if ActiveRecord::Base.connection.table_exists?('rooms_users')
    drop_table :rooms if ActiveRecord::Base.connection.table_exists?('rooms')
    drop_table :answers if ActiveRecord::Base.connection.table_exists?('answers')
    drop_table :exercises if ActiveRecord::Base.connection.table_exists?('exercises')
  end
end
