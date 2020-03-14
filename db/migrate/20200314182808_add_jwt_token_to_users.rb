class AddJwtTokenToUsers < ActiveRecord::Migration[6.0]
  def up
    add_column :users, :jwt_token, :string
    User.find_each do |user|
      user.set_jwt_token
      user.save!
    end
  end

  def down
    remove_column :users, :jwt_token
  end
end
