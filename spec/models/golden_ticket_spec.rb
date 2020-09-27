require 'rails_helper'

RSpec.describe GoldenTicket, type: :model do
  it "#set_unique_cod should generate a code of 9 letters/digits" do
    golden_ticket = GoldenTicket.new
    golden_ticket.set_unique_code
    expect(golden_ticket.code).not_to eq nil
    expect(golden_ticket.code.size).to eq 9
  end
end
