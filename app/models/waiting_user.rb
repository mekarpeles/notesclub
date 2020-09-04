class WaitingUser < ApplicationRecord
  validates :email,
    format: { with: /\A(.+)@(.+)\z/, message: "invalid"  },
    uniqueness: { case_sensitive: false, scope: :comment, message: "already in the waiting list" },
    length: { minimum: 4, maximum: 254 }
end
