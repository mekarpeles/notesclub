class CreateTopics < ActiveRecord::Migration[6.0]
  def change
    create_table :topics do |t|
      t.text :content
      t.integer :user_id
      t.string :ancestry

      t.timestamps
    end

    add_index :topics, :ancestry
    add_index :topics, :user_id
  end
end
