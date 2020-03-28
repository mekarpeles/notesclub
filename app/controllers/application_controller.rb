class ApplicationController < ActionController::API
  include ::ActionController::Cookies

  respond_to :json

  before_action :authenticate_user!

  private

  def current_user_id
    @current_user_id ||= authenticate
  end

  def authenticate
    # puts "jwt: #{jwt_token}"
    Rails.logger.info("jwt: #{jwt_token[0..2]}...")
    return 1 if Rails.env.development? && ENV["SKIP_AUTH_IN_DEV"]
    begin
      jwt_payload = JWT.decode(jwt_token, Rails.application.credentials.config[:secret_key_base]).first
      jwt_payload['id']
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      head :unauthorized
    end
  end

  def jwt_token
    @jwt_token ||= cookies.signed[:jwt] || ""
  end

  def authenticate_user!(options = {})
    head :unauthorized unless signed_in?
  end

  def current_user
    @current_user ||= super || User.find(current_user_id)
  end

  def signed_in?
    current_user_id.present?
  end
end
