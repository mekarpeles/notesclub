class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create, :confirmation]
  before_action :authenticate_param_user!, only: :update
  EXPOSED_ATTRIBUTES = %w(id name username created_at updated_at).freeze

  def index
    users = User.select(EXPOSED_ATTRIBUTES)
    users = users.where(id: params["ids"]) if params["ids"].present?
    users = users.where(username: params["username"]) if params["username"].present?
    render json: users.order(id: :desc).limit(100).to_json
  end

  def show
    user = User.select(EXPOSED_ATTRIBUTES).find(params["id"])
    render json: user.to_json, status: :ok
  end

  def update
    if current_user.update_attributes(user_params)
      track_user
      render :show
    else
      render json: { errors: current_user.errors }, status: :unprocessable_entity
    end
  end

  def create
    creator = UserCreator.new(params.permit(:email, :password, :name, :username, :golden_ticket_code))
    if creator.create
      log_in_as(creator.user)
      track_user
      render json: { user: creator.user.slice(EXPOSED_ATTRIBUTES) }, status: :created
    else
      Rails.logger.info "Errors: #{creator.errors.inspect}"
      render json: { errors: creator.errors }, status: :unprocessable_entity
    end
  end

  def confirmation
    user = User.where("confirmed_at is null").find_by(confirmation_token: params[:token])
    if user
      user.confirm
      log_in_as(user)
      render json: { user: user.slice(EXPOSED_ATTRIBUTES) }, status: :ok
    else
      render json: { errors: ["Wrong token"] }, status: :unprocessable_entity
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
