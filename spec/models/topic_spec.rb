require 'rails_helper'

RSpec.describe Topic, type: :model do
  context "#create" do
    before do
      Topic.find(3).destroy # Somehow destroy_all doesn't find the topic with id=3
      Topic.destroy_all
    end

    it "should create a record" do
      t = Topic.new(content: "Climate Change")
      t.save
      expect(t.errors.full_messages).to eq([])
    end

    it "should set the position as last if not given" do
      t0 = Topic.create!(content: "topic 0")
      t1 = t0.children.create!(content: "topic 1")
      t2 = t0.children.create!(content: "topic 2")
      t3 = t0.children.create!(content: "topic 3")
      expect(t1.position).to eq(1)
      expect(t2.position).to eq(2)
      expect(t3.position).to eq(3)
    end

    it "should reorder siblings when position is given" do
      t0 = Topic.create!(content: "topic 0")
      t1 = t0.children.create!(content: "topic 1")
      t2 = t0.children.create!(content: "topic 2")
      t3 = t0.children.create!(content: "topic 3")
      t4 = t0.children.create!(content: "topic 4", position: 2)
      expect(t1.position).to eq(1)
      expect(t4.position).to eq(2)
      expect(t2.reload.position).to eq(3)
      expect(t3.reload.position).to eq(4)
    end
  end

  context "#update" do
    it "indenting should reorder both old siblings' positions" do
      t0 = Topic.create!(content: "topic 0")
      t1 = t0.children.create!(content: "topic 1")
      t2 = t0.children.create!(content: "topic 2")
      t3 = t0.children.create!(content: "topic 3")
      t4 = t3.children.create!(content: "topic 4")
      t5 = t3.children.create!(content: "topic 4")

      t2.update!(ancestry: "#{t0.id}/#{t3.id}", position: 3)
      expect(t1.reload.position).to eq(1)
      expect(t3.reload.position).to eq(2)
      expect(t4.reload.position).to eq(1)
      expect(t5.reload.position).to eq(2)
      expect(t2.reload.position).to eq(3)
    end
  end

  context "#destroy" do
    it "should delete descendants" do
      t0 = Topic.create!(content: "topic 0")
      t1 = Topic.create!(content: "topic 1")
      t2 = t1.children.create!(content: "topic 1")

      expect { t1.destroy }.to change { Topic.count }.by(-2)
    end
  end
end
