require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  describe "Login" do
    it "returns http success and user attributes" do
      params = { email: "hec@hec.com", password: "hec7hec" }
      headers = { "ContentType" => "application/json" }
      user = User.create!(params)
      post "/api/users/login", { params: { user: params }, headers: headers }
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq({"user" => {"id" => user.id, "email" => user.email, "name" => user.name, "username" => user.username}})
    end
  end
end
