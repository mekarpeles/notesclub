class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable

  self.skip_session_storage = [:http_auth, :params_auth]

  has_many :topics

  before_validation :set_provisional_username, on: :create
  after_create :reset_jwt_token

  PROVISIONAL_USERNAME_LENGTH = 10

  validates_uniqueness_of :username, :email

  def reset_jwt_token
    # Need to expire it in X days (see generate_jwt)
    self.update(jwt_token: generate_jwt)
  end

  def generate_jwt
    JWT.encode(
      {
        id: id,
        exp: 60.days.from_now.to_i
      },
      Rails.application.credentials.config[:secret_key_base]
    )
  end

  private

  def set_provisional_username
    loop do
      self.username = SecureRandom.alphanumeric(10)
      break unless User.where(username: PROVISIONAL_USERNAME_LENGTH).exists?
    end
    true
  end
end
