require 'rails_helper'

RSpec.describe Exercise::KeyWordTransformationValidator, type: :model do
  fixtures(:all)

  it "should complain if data is not a JSON hash" do
    exercise = Exercise.create(name: "KeyWordTransformation", created_by: users(:user1))
    expect { exercise }.to change{ Exercise.count }.by(0)
    expect(exercise.errors.to_hash).to eq({data: ["must be a JSON hash"]})
  end

  it "should require all fields if none is passed" do
    exercise = Exercise.create(name: "KeyWordTransformation", created_by: users(:user1), data: {}.to_json)
    expect(exercise.errors.to_hash).to eq({data: [
      "must include solutions (array of strings)",
      "must include title (string)",
      "must include description (string)",
      "must include originalSentence (string)",
      "must include part1 (string)",
      "must include part2 (string)",
      "must include word (string)"
    ]})
  end
end
