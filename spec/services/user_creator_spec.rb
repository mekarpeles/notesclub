require 'rails_helper'

RSpec.describe "UserCreator" do
  fixtures(:users)
  let(:user) { users(:user1) }
  let(:golden_ticket) { GoldenTicket.create(code: "123456789", user_id: user.id) }

  it "should create a user" do
    creator = UserCreator.new(name: "Hec", username: "hec77", email: "hec@tor.com", password: "something dadad", golden_ticket_code: golden_ticket.code)
    expect { creator.create }.to change { User.count }.by(1)
    expect(creator.errors).to eq([])
    expect(User.last.slice(:name, :username, :email, :invited_by_id)).to eq("name" => "Hec", "username" => "hec77", "email" => "hec@tor.com", "invited_by_id" => golden_ticket.user_id)
  end

  it "should NOT create a user if the password is not passed" do
    creator = UserCreator.new(name: "Hec", username: "hec878", email: "hec@tor.com", golden_ticket_code: golden_ticket.code)
    creator.create
    expect(creator.errors).to eq(["Validation failed: Password can't be blank"])
  end
end
