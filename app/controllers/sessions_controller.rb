class SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!

  def create
    user = User.find_by_email(sign_in_params[:email])

    if user && user.valid_password?(sign_in_params[:password])
      Rails.logger.info("action:user_login:#{user.id}")
      @current_user = user
    else
      render json: { errors: { 'email or password' => ['is invalid'] }}, status: :unprocessable_entity
    end
  end
end
