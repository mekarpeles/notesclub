class ApplicationController < ActionController::API
  include ::ActionController::Cookies

  respond_to :json

  before_action :authenticate_user!

  private

  def track_action(event, properties = {})
    if current_user.present? && ENV['WIKIR_SEGMENT_ENABLED'].to_s == "true"
      Analytics.track(
        user_id: current_user.id.to_s,
        event: event,
        properties: properties.merge({ current_user_username: current_user.username} ))
    end
  end

  def current_user_id
    @current_user_id ||= authenticate
  end

  def authenticate
    return 1 if Rails.env.development? && ENV["SKIP_AUTH_IN_DEV"]
    begin
      jwt_payload = JWT.decode(jwt_token, Rails.application.credentials.config[:secret_key_base]).first
      jwt_payload['id']
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      head :unauthorized
    end
  end

  def jwt_token
    @jwt_token ||= (cookies.signed[:jwt] || request.cookies["jwt"] || "")
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

  def log_in_as(user)
    user.reset_jwt_token
    user.save!
    cookies.signed[:jwt] = {value: user.jwt_token, httponly: true}
    # response.set_cookie(
    #   :jwt,
    #   {
    #     value: user.jwt_token,
    #     expires: 30.days.from_now,
    #     httponly: true,
    #   }
    # )
    @current_user = user
  end
end
