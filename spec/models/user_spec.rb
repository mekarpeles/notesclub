require 'rails_helper'

RSpec.describe User do
  context "#create" do
    it "should set a provisional username" do
      user = User.create!(email: "hec7@hec.com", password: "yeah712")
      expect(user.username).not_to eq nil
      expect(user.username.length).to eq User::PROVISIONAL_USERNAME_LENGTH
    end
  end
end
