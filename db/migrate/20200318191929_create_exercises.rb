class CreateExercises < ActiveRecord::Migration[6.0]
  def change
    create_table :exercises do |t|
      t.string :name
      t.json :data
      t.integer :created_by_id

      t.timestamps
    end
  end
end
