class WaitingUsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]

  def create
    waiting_user = WaitingUser.new(params.permit(:email, :comment))
    if !verify_recaptcha(model: waiting_user)
      render json: { errors: "Are you a human? If so, please refresh and try again." }, status: :bad_request
    elsif waiting_user.save
      render json: waiting_user
    else
      render json: { errors: waiting_user.errors }, status: :bad_request
    end
  end
end
