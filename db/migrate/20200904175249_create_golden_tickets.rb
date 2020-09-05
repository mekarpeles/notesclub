class CreateGoldenTickets < ActiveRecord::Migration[6.0]
  def change
    create_table :golden_tickets do |t|
      t.integer :user_id, allow_nil: false
      t.string :code, allow_nil: false

      t.timestamps
    end
  end
end
