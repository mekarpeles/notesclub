class TopicsController < ApplicationController
  before_action :authenticate_param_user!, only: [:update, :create, :destroy]

  def index
    topics = Topic
    topics = topics.where(id: params["ids"]) if params["ids"].present? && params["ids"].is_a?(Array)
    topics = topics.where(user_id: params["user_ids"]) if params["user_ids"].present? && params["user_ids"].is_a?(Array)
    topics = topics.where(ancestry: params["ancestry"]) if params.include?("ancestry")
    topics = topics.where(slug: params["slug"]) if params["slug"]
    limit = params["slug"] || (params["ids"] && params["ids"].size == 1) ? 1 : 100
    topics = topics.order(updated_at: :desc).limit(limit)

    if params[:include_descendants]
      render json: topics.to_json(methods: :descendants)
    else
      render json: topics.to_json
    end
  end

  def show
    topics = Topic
    topics = topics.where(id: params[:id]) if params[:id]
    topics = topics.where(slug: params[:slug].downcase) if params[:slug]
    topic = topics.first

    if params[:include_descendants]
      render json: topic.to_json(methods: :descendants)
    else
      render json: topic.to_json
    end
  end
end
