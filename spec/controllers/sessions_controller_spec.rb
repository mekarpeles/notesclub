require 'rails_helper'

RSpec.describe SessionsController, type: :request do
  context "Login" do
    before do
      @params = { email: "hec2@hec.com", password: "hec2hec" }
      @user = User.create!(@params)
    end

    it "returns http success" do
      post "/v1/users/login", { params: { user: @params } }
      expect(response).to have_http_status(:success)
    end

    it "sets cookie" do
      # It seems we can not test encrypted cookies in controller specs https://github.com/rails/rails/issues/27145
      # TODO: Test it in an integration spec
      expect_any_instance_of(ActionDispatch::Cookies::CookieJar).to receive(:signed).and_return({jwt: nil })
      post "/v1/users/login", { params: { user: @params } }
      expect(cookies[:jwt])
    end

    it "returns user attributes" do
      post "/v1/users/login", { params: { user: @params } }
      json = JSON.parse(response.body)
      expect(json).to eq({"user" => {"id" => @user.id, "name" => @user.name, "username" => @user.username}})
    end
  end
end
