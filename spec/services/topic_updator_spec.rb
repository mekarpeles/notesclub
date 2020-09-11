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

  context "when update_topics_with_links=true" do
    let(:user1) { users(:user1) }
    let(:user2) { users(:user2) }

    it "should update all topics from the user with links" do
      t1 = Topic.create!(content: "Books", user: user1)
      t2 = Topic.create!(content: "I like [[Books]] and [[Music]] and [[Books]]", user: user1)
      t3 = Topic.create!(content: "Favourite [[Books]]", user: user1)
      t4 = Topic.create!(content: "Great [[Books]]", user: user2)

      update_topics_with_links = true
      updator = TopicUpdator.new(t1, update_topics_with_links)
      expect(updator.update(content: "Books and articles")).to eq(true)
      expect(t1.reload.content).to eq("Books and articles")
      expect(t2.reload.content).to eq("I like [[Books and articles]] and [[Music]] and [[Books and articles]]")
      expect(t3.reload.content).to eq("Favourite [[Books and articles]]")
      # Should not modify t4 because user is different
      expect(t4.reload.content).to eq("Great [[Books]]")
    end
  end
end
