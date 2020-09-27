class GoldenTicket < ApplicationRecord
  belongs_to :user, optional: true
  has_one :waiting_user

  validates :code,
    length: { in: 6..20, allow_nil: false, message: "must have at least 8 characters"},
    uniqueness: true

  def set_unique_code
    self.code = generate_unique_random_code
  end

  private

  def generate_unique_random_code
    new_code = nil
    loop do
      new_code = SecureRandom.alphanumeric(9).downcase
      break unless code_exists?(new_code)
    end
    new_code
  end

  def code_exists?(new_code)
    GoldenTicket.exists?(code: new_code)
  end
end
