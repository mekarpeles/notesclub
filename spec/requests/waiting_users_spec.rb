require 'rails_helper'

RSpec.describe WaitingUsersController, type: :request do
  describe "#create" do
    it "should create and save an email and comment" do
      expect { post "/v1/waiting_users", params: { email: "my@email.com", comment: "I'd love to join!" } }.to change{ WaitingUser.count }.by(1)
      w = WaitingUser.last
      expect(w.email).to eq("my@email.com")
      expect(w.comment).to eq("I'd love to join!")
    end
  end
end
