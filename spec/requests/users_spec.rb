require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users)
  let(:user) { users(:user1) }

  describe "#index" do
    it "should return success and attributes" do
      log_in(user)
      get "/v1/users", params: { username: "hec"}
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result.first.slice(*%w(id name username))).to eq({"id" => user.id, "name" => user.name, "username" => user.username})
    end
  end

  describe "#show" do
    it "should return success and attributes" do
      log_in(user)
      get "/v1/users/#{user.id}"
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result.slice(*%w(id name username))).to eq({"id" => user.id, "name" => user.name, "username" => user.username})
    end
  end

  describe "#create" do
    it "should create a user" do
      GoldenTicket.create!(code: "123456789", user_id: user.id)
      post "/v1/users", params: { name: "Hec", username: "hec878", email: "hec878@hec.com", password: "mypassword", golden_ticket_code: "123456789"}
      result = JSON.parse(response.body)
      expect(result["errors"] || []).to eq([])
      expect(response).to have_http_status(:success)
      expect(User.last.slice("name", "username", "email", "invited_by_id")).to eq("name" => "Hec", "username" => "hec878", "email" => "hec878@hec.com", "invited_by_id" => user.id)
    end
  end
end
