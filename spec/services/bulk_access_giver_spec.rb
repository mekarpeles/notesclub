require 'rails_helper'

RSpec.describe BulkAccessGiver do
  before do
    @wu1 = WaitingUser.create!(email: "book@notes.club")
    @wu2 = WaitingUser.create!(email: "book2@notes.club")
    WaitingUser.create!(email: "book3@notes.club")
    WaitingUser.create!(email: "book4@notes.club")
  end

  it "should create 2 golden tickets" do
    bulk_access_giver = BulkAccessGiver.new(2)
    expect { bulk_access_giver.give_access }.to change { GoldenTicket.count }.by(2)
    expect(@wu1.reload.golden_ticket_id).not_to eq(nil)
    expect(@wu2.reload.golden_ticket_id).not_to eq(nil)
  end

  it "should send 2 emails" do
    bulk_access_giver = BulkAccessGiver.new(2)
    expect {
      bulk_access_giver.give_access
    }.to change { ActionMailer::Base.deliveries.size }.by(2)
    mail1 = ActionMailer::Base.deliveries.first
    mail2 = ActionMailer::Base.deliveries.last
    expect(mail1.to[0]).to eq(@wu1.email)
    expect(mail2.to[0]).to eq(@wu2.email)
  end
end
