require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users)

  context "#show" do
    it "should return success and attributes" do
      user = users(:user1)
      log_in(user)
      get "/api/users/#{user.id}"
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json).to eq({"user" => {"id" => user.id, "email" => user.email, "name" => user.name, "username" => user.username}})
    end
  end
end
