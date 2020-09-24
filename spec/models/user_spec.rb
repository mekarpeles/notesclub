require 'rails_helper'

RSpec.describe User do
  fixtures :users

  context "#create" do
    it "should not allow two usernames with same downcase" do
      User.create!(username: "Aa", name: "jjj", email: "hhh@go.com", password: "qwerty", password_confirmation: "qwerty", invited_by: User.first)
      expect { User.create!(username: "aa", name: "jjj2", email: "hhh2@go.com", password: "qwerty", password_confirmation: "qwerty", invited_by: User.first) }.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Username has already been taken")
    end

    it "should not require invited_by" do
      expect { User.create!(username: "Aa", name: "jjj", email: "hhh@go.com", password: "qwerty", password_confirmation: "qwerty") }.not_to raise_error
    end
  end
end
