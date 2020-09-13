class User < ApplicationRecord
  devise :database_authenticatable, :confirmable, :rememberable, :validatable

  self.skip_session_storage = [:http_auth, :params_auth]

  has_many :topics
  has_many :golden_tickets
  has_many :invitees, class_name: 'User', foreign_key: :invited_by_id
  belongs_to :invited_by, class_name: 'User', foreign_key: :invited_by_id

  after_create :reset_jwt_token

  validates :email,
    format: { with: /\A(.+)@(.+)\z/, message: "invalid"  },
    uniqueness: { case_sensitive: false },
    length: { minimum: 4, maximum: 254 }

  validates_uniqueness_of :username,
    uniqueness: { case_insensitive: false },
    length: { minimum: 3, maximum: 15 }

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
end
