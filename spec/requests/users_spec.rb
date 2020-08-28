require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users)

  describe "#index" do
    it "should return success and attributes" do
      user = users(:user1)
      log_in(user)
      get "/v1/users", params: { username: "hec"}
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result.first.slice(*%w(id name username))).to eq({"id" => user.id, "name" => user.name, "username" => user.username})
    end
  end

  describe "#show" do
    it "should return success and attributes" do
      user = users(:user1)
      log_in(user)
      get "/v1/users/#{user.id}"
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result.slice(*%w(id name username))).to eq({"id" => user.id, "name" => user.name, "username" => user.username})
    end
  end


end
