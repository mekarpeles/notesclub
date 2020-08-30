class AddPositionToTopic < ActiveRecord::Migration[6.0]
  def change
    add_column :topics, :position, :integer
  end
end
