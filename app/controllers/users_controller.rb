class UsersController < ApplicationController
  EXPOSED_ATTRIBUTES = %w(id name username created_at updated_at).freeze
  before_action :authenticate_param_user!, only: :update

  def index
    users = User.select(EXPOSED_ATTRIBUTES)
    users.where(id: params["ids"].split(",")) if params["ids"].present?
    render json: users.order(id: :desc).limit(100).to_json
  end

  def show
    user = User.select(EXPOSED_ATTRIBUTES).find(params["id"])
    render json: user.to_json, status: :ok
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
