class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :create

  def create
    sign_in_params = params[:user]
    user = User.find_by_email(sign_in_params[:email])
    if user && user.valid_password?(sign_in_params[:password])
      Rails.logger.info("action:user_login:#{user.id}")
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
    else
      render json: { errors: { 'email or password' => ['is invalid'] }}, status: :unauthorized
    end
  end

  def destroy
    cookies.signed[:jwt] = {}
    # response.delete_cookie(:jwt)
    render json: "done".to_json
  end
end
