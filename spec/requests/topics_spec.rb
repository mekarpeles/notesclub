require 'rails_helper'

RSpec.describe UsersController, type: :request do
  fixtures(:users, :topics)
  let(:user) { users(:user1) }
  let(:topic1) { topics(:topic1) }
  let(:topic2) { topics(:topic2) }

  before do
    log_in(user)
  end

  def rm_timestamps(obj)
    obj.except!("created_at", "updated_at")
  end

  context "#index" do
    it "should find topics by ids" do
      get "/v1/topics", params: { ids: [topic1.id, topic2.id], ancestry: nil }
      expect(response).to have_http_status(:success)
      topics = JSON.parse(response.body)
      expect(topics.map{|t| rm_timestamps(t)}).to eq([rm_timestamps(topic1.attributes), rm_timestamps(topic2.attributes)])
    end

    it "should filter per user_ids and ancestry" do
      get "/v1/topics", params: { user_ids: [user.id], ancestry: nil }
      expect(response).to have_http_status(:success)
      topics = JSON.parse(response.body)
      expect(topics).to eq([
        {"ancestry"=>nil, "content"=>"Climate Change", "id"=>1, "user_id"=>1, "slug"=>"climate_change", "created_at"=>"2020-08-29T11:01:41.208Z", "updated_at"=>"2020-08-29T11:01:41.208Z"},
        {"ancestry"=>nil, "content"=>"2020-08-28",     "id"=>2, "user_id"=>1, "slug"=>"2020-08-28", "created_at"=>"2020-08-29T11:01:41.208Z", "updated_at"=>"2020-08-29T11:01:41.208Z"}
      ])
      expect(response.status).to eq(200)
    end
  end

  context "#show" do
    it "should return descendants if flag is passed" do
      Topic.where.not(id: [2, 3, 4]).destroy_all
      get "/v1/topics/#{topic2.id}", params: { include_descendants: true }
      expect(response).to have_http_status(:success)
      topic2 = JSON.parse(response.body)
      expect(topic2).to eq({
        "id"=>2,
        "content"=>"2020-08-28",
        "user_id"=>1,
        "ancestry"=>nil,
        "created_at"=>"2020-08-29T11:01:41.208Z",
        "updated_at"=>"2020-08-29T11:01:41.208Z",
        "slug"=>"2020-08-28",
        "descendants"=>[
          {"id"=>3, "content"=>"I started to read [[How to take smart notes]]", "user_id"=>1, "ancestry"=>"2", "created_at"=>"2020-08-29T11:01:41.208Z", "updated_at"=>"2020-08-29T11:01:41.208Z", "slug"=>"jdjiwe23m"},
          {"id"=>4, "content"=>"I #love it", "user_id"=>1, "ancestry"=>"2/3", "created_at"=>"2020-08-29T11:01:41.208Z", "updated_at"=>"2020-08-29T11:01:41.208Z", "slug"=>"ds98wekjwe"}
        ]
      })
      expect(response.status).to eq(200)
    end
  end
end
