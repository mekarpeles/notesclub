class TopicsController < ApplicationController
  EXPOSED_ATTRIBUTES = %w(id user_id content ancestry slug)
  before_action :authenticate_param_user!, only: [:update, :create, :destroy]
  before_action :set_user_topic, only: [:show, :update, :destroy]

  def index
    topics = Topic.select(EXPOSED_ATTRIBUTES)
    topics = topics.where(user_id: params["user_ids"]) if params["user_ids"].present? && params["user_ids"].is_a?(Array)
    topics = topics.where(ancestry: params["ancestry"]) if params.include?("ancestry")
    topics = topics.where(slug: params["slug"]) if params["slug"]
    render json: topics.order(updated_at: :desc).limit(100).to_json
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_topic
      @user_topic = UserTopic.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_topic_params
      params.require(:user_topic).permit(:content, :key, :user_id)
    end
end
