class AddInvitedByIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :invited_by_id, :integer
  end
end
