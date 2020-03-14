class ApplicationController < ActionController::API
  respond_to :json

  before_action :authenticate_user!

  private

  def current_user_id
    @current_user_id = begin
      return nil if jwt_token.blank?
      begin
        jwt_payload = JWT.decode(jwt_token, Rails.application.secrets.secret_key_base).first
        jwt_payload['id']
      rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
        head :unauthorized
      end
    end
  end

  def jwt_token
    @jwt_token ||= request.headers['Authorization']
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
