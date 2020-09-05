class GoldenTicket < ApplicationRecord
  belongs_to :user

  validates_presence_of :user_id
  validates :code,
    length: { in: 8..20, allow_nil: false, message: "must have at least 8 characters"},
    uniqueness: true
end
