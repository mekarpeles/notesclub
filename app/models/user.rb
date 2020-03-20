class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable

  before_create :set_provisional_username, :reset_jwt_token

  PROVISIONAL_USERNAME_LENGTH = 10

  validates_uniqueness_of :username, :email

  def reset_jwt_token
    # Need to expire it in X days (see generate_jwt)
    self.jwt_token = generate_jwt
  end

  private

  def generate_jwt
    JWT.encode(
      {
        id: id,
        exp: 60.days.from_now.to_i
      },
      Rails.application.secrets.secret_key_base
    )
  end

  def set_provisional_username
    loop do
      self.username = SecureRandom.alphanumeric(10)
      break unless User.where(username: PROVISIONAL_USERNAME_LENGTH).exists?
    end
  end
end