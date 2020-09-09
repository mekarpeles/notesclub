class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :create

  def create
    sign_in_params = params[:user]
    user = User.find_by_email(sign_in_params[:email])
    if user && user.valid_password?(sign_in_params[:password])
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
