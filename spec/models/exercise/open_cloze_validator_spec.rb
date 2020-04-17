require 'rails_helper'

RSpec.describe Exercise::OpenClozeValidator, type: :model do
  fixtures(:all)

  it "should complain if data is not a JSON hash" do
    exercise = Exercise.create(name: "OpenCloze", created_by: users(:user1))
    expect { exercise }.to change{ Exercise.count }.by(0)
    expect(exercise.errors.to_hash).to eq({data: ["must be a JSON hash"]})
  end

  it "should require all fields if none is passed" do
    exercise = Exercise.create(name: "OpenCloze", created_by: users(:user1), data: {}.to_json)
    expect(exercise.errors.to_hash).to eq({
      data: [
        "title can't be blank.",
        "description can't be blank.",
        "text can't be blank.",
        "solutions can't be blank."
      ]})
  end

  it "should pass all validations" do
    data = {
      "title"=>"Open Cloze",
      "description"=>"Use the word given in capitals to form a word that fits in the gap. There is an example at the beginning (0).",
      "text"=>"Garlic, a member of the Lilliaceae family which also includes onions, is (0) ..... (COMMON) used in cooking all around the world. China is currently the largest (1) ..... (PRODUCT) of garlic, which is particularly associated with the dishes of northern Africa and southern Europe. It is native to central Asia and has long had a history as a health-giving food, used both to prevent and cure (2) ..... (ILL) In ancient Egypt, workers building the pyramids were given garlic to keep them strong, while Olympic athletes in Greece ate it to increase their resistance to infection. The forefather of antibiotic medicine, Louis Pasteur, claimed garlic was as (3) ..... (EFFECT) as penicillin in treating infections. Modern-day (4) ..... (SCIENCE) have proved that garlic can indeed kill bacteria and even some viruses, so it can be very useful for people who have coughs and colds. In (5) ..... (ADD), some doctors believe that garlic can reduce blood (6) ..... (PRESS) The only (7) ..... (ADVANTAGE) to this truly amazing food is that the strong and rather (8) ..... (SPICE) smell of garlic is not the most pleasant!",
      "solutions"=>[["commonly"], ["producer"], ["illness", "illnesses"], ["effective"], ["scientists"], ["addition"], ["pressure"], ["disadvantage"], ["spicy"]]
    }
    exercise = Exercise.create(name: "OpenCloze", created_by: users(:user1), data: data.to_json)
    expect(exercise.errors.to_hash).to eq({})
  end

  it "should fail if a solution is blank" do
    data = {
      "title"=>"Open Cloze",
      "description"=>"Use the word given in capitals to form a word that fits in the gap. There is an example at the beginning (0).",
      "text"=>"Garlic, a member of the Lilliaceae family which also includes onions, is (0) ..... (COMMON) used in cooking all around the world. China is currently the largest (1) ..... (PRODUCT) of garlic, which is particularly associated with the dishes of northern Africa and southern Europe. It is native to central Asia and has long had a history as a health-giving food, used both to prevent and cure (2) ..... (ILL) In ancient Egypt, workers building the pyramids were given garlic to keep them strong, while Olympic athletes in Greece ate it to increase their resistance to infection. The forefather of antibiotic medicine, Louis Pasteur, claimed garlic was as (3) ..... (EFFECT) as penicillin in treating infections. Modern-day (4) ..... (SCIENCE) have proved that garlic can indeed kill bacteria and even some viruses, so it can be very useful for people who have coughs and colds. In (5) ..... (ADD), some doctors believe that garlic can reduce blood (6) ..... (PRESS) The only (7) ..... (ADVANTAGE) to this truly amazing food is that the strong and rather (8) ..... (SPICE) smell of garlic is not the most pleasant!",
      "solutions"=>[["commonly"], ["producer"], [""], ["effective"], ["scientists"], ["addition"], ["pressure"], ["disadvantage"], ["spicy"]]
    }
    exercise = Exercise.create(name: "OpenCloze", created_by: users(:user1), data: data.to_json)
    expect(exercise.errors.to_hash).to eq({data: ["solutions can't be empty."]})
  end
end
