class UsersController < ApplicationController
  before_action :authenticate_param_user!, only: :update

  def index
    render json: User.limit(100).select(%w(id name username created_at updated_at)).order(id: :desc).to_json
  end

  def show
  end

  def update
    if current_user.update_attributes(user_params)
      render :show
    else
      render json: { errors: current_user.errors }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_param_user!
    head :unauthorized if current_user.id.to_s != params[:id]
  end

  def user_params
    params.require(:user).permit(:name, :username, :email, :password)
  end
end
