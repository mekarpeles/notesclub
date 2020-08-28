require 'rails_helper'

RSpec.describe Topic, type: :model do
  it "should create a record" do
    t = Topic.new(content: "Climate Change")
    t.save
    expect(t.errors.full_messages).to eq([])
  end
end
