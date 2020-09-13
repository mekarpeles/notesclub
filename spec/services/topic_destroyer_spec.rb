require 'rails_helper'

RSpec.describe TopicDeleter do
  fixtures :users
  let(:user1) { users(:user1) }

  it "should destroy topic and descendants" do
    t1 = Topic.create!(content: "bla", user: user1)
    t2 = t1.children.create!(content: "bla", user: user1)
    t3 = t1.children.create!(content: "bla", user: user1)
    t4 = t3.children.create!(content: "bla", user: user1)

    destroyer = TopicDeleter.new(t1, include_descendants: true)
    result = nil
    expect { result = destroyer.delete }.to change { Topic.count }.by(-4)
    expect(result).to eq(true)
  end
end
