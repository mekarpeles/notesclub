class AddSlugToTopics < ActiveRecord::Migration[6.0]
  def up
    add_column :topics, :slug, :string
    Topic.all.find_each do |topic|
      topic.set_slug
      topic.save!
    end
    change_column :topics, :slug, :string, null: false
    add_index :topics, [:slug, :user_id], unique: true
  end

  def down
    remove_column :topics, :slug
  end
end
