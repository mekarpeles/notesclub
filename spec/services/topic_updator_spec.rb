require 'rails_helper'

RSpec.describe TopicUpdator do
  fixtures(:users, :topics)

  let(:topic) { topics(:topic1) }

  it "should create new topics if they do not exist" do
    Topic.create!(content: "This already exists", user_id: topic.user_id)
    updator = TopicUpdator.new(topic)
    expect{ updator.update(content: "[[Books]] and [[Music]] and [[This already exists]]") }.to change{ Topic.count }.by(2)
    expect(topic.reload.content).to eq("[[Books]] and [[Music]] and [[This already exists]]")
    t2, t1 = Topic.order(id: :desc).limit(2)
    expect(t1.attributes.slice(*%w(ancestry content slug user_id))).to eq({
      "ancestry" => nil,
      "content" => "Books",
      "slug" => "books",
      "user_id" => topic.user_id
    })
    expect(t2.attributes.slice(*%w(ancestry content slug user_id))).to eq({
      "ancestry" => nil,
      "content" => "Music",
      "slug" => "music",
      "user_id" => topic.user_id
    })
  end
end
