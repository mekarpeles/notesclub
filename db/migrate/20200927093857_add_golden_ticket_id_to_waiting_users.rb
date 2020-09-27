class AddGoldenTicketIdToWaitingUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :waiting_users, :golden_ticket_id, :integer
  end
end
