require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users, :topics)

  context "#show" do
    it "should filter per user_ids and ancestry" do
      user = users(:user1)
      log_in(user)
      get "/v1/topics", params: { user_ids: [user.id], ancestry: nil }
      expect(response).to have_http_status(:success)
      topics = JSON.parse(response.body)
      expect(topics).to eq([
        {"ancestry"=>nil, "content"=>"Climate Change", "id"=>1, "user_id"=>1, "slug"=>"climate_change"},
        {"ancestry"=>nil, "content"=>"2020-08-28",     "id"=>2, "user_id"=>1, "slug"=>"2020-08-28"}
      ])
      expect(response.status).to eq(200)
    end
  end
end
