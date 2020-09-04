class CreateWaitingUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :waiting_users do |t|
      t.string :email
      t.text :comment

      t.timestamps
    end
  end
end
