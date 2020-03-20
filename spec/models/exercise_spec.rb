require 'rails_helper'

RSpec.describe Exercise, type: :model do
  fixtures(:all)

  it "name must be one from the list" do
    exercise = Exercise.new(name: "whatever", created_by: users(:user1))
    expect { exercise.save }.not_to change{ Exercise.count }
    names = Exercise::NAMES.join(", ")
    expect(exercise.errors.to_hash).to eq({name: ["must be one of these: #{names}"]})
  end
end
