require 'rails_helper'

RSpec.describe GoldenTicketsController, type: :request do
  fixtures(:users)
  let(:user) { users(:user1) }

  describe "#check" do
    it "should return true" do
      GoldenTicket.create!(code: "123456789", user: user)
      get "/v1/golden_tickets/check", params: { code: "123456789"}
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result["found"]).to eq(true)
    end

    it "should return false" do
      expect(GoldenTicket.exists?(code: "123456789")).to eq(false)
      get "/v1/golden_tickets/check", params: { code: "123456789"}
      expect(response).to have_http_status(:success)
      result = JSON.parse(response.body)
      expect(result["found"]).to eq(false)
    end
  end
end
