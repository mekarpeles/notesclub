require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users)

  context "#show" do
    it "should return success and attributes" do
      user = users(:user1)
      log_in(user)
      get "/v1/users/#{user.id}"
      expect(response).to have_http_status(:success)
      args = JSON.parse(response.body)
      expect(args.slice(*%w(id name username))).to eq({"id" => user.id, "name" => user.name, "username" => user.username})
    end
  end
end
