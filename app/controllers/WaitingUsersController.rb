class WaitingUsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]

  def create
    waiting_user = WaitingUser.new(params.permit(:email, :comment))
    if waiting_user.save
      render json: waiting_user
    else
      render json: { errors: waiting_user.errors }, status: :bad_request
    end
  end
end
