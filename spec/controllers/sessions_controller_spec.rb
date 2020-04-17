require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  describe "Login" do
    before do
      params = { email: "hec2@hec.com", password: "hec2hec" }
      @user = User.create!(params)
      post "/v1/users/login", { params: { user: params } }
    end

    it "returns http success" do
      expect(response).to have_http_status(:success)
    end

    it "sets cookie" do
      expect(cookies[:jwt]).to eq(@user.jwt_token)
    end

    it "returns user attributes" do
      json = JSON.parse(response.body)
      expect(json).to eq({"user" => {"role" => @user.role, "id" => @user.id, "name" => @user.name, "username" => @user.username}})
    end
  end
end
