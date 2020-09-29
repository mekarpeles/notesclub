class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :create

  def create
    user = User.find_by_email(params[:email])
    if !verify_recaptcha
      render json: { errors: { 'captcha:' => ["Are you human? If so, please refresh and try again."] } }, status: :unauthorized
    elsif user && user.valid_password?(params[:password])
      Rails.logger.info("action:user_login:#{user.id}")
      log_in_as(user)
      track_user
      track_action("Log in")
    else
      render json: { errors: { 'email or password' => ['is invalid'] }}, status: :unauthorized
    end
  end

  def destroy
    if current_user
      track_action("Log out")
      cookies.delete(:jwt)
      render json: "done", status: :ok
    else
      render json: "session not found", status: :unprocessable_entity
    end
  end
end
