require 'rails_helper'

RSpec.describe ExercisesController, type: :request do
  fixtures(:all)
  let(:user) { users(:user1) }

  before do
    log_in(user)
  end

  describe "GET #index" do
    before do
      get "/api/exercises"
    end

    it "returns http success" do
      expect(response).to have_http_status(:success)
    end

    it "JSON body response contains name" do
      hash_body = JSON.parse(response.body)
      expect(hash_body.first.keys).to match_array(%w(id name data created_by_id created_at updated_at))
    end
  end

  describe "POST #create" do
    it "should create exercise" do
      data = {"bla" => "bla"}.to_json
      expect { post "/api/exercises", params: { exercise: { name: "KeyWordTransformation", data: data}} }.to change{ Exercise.count }.by(1)
      exercise = Exercise.last
      expect(exercise.name).to eq "KeyWordTransformation"
      expect(exercise.data).to eq data
      expect(exercise.created_by).to eq user
    end
  end
end
