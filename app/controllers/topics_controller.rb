class TopicsController < ApplicationController
  before_action :set_topic, only: [:update, :destroy]
  before_action :authenticate_param_id!, only: [:update, :destroy]
  before_action :authenticate_param_user_id!, only: [:create]

  def index
    topics = Topic
    topics = topics.where(id: params["ids"]) if params["ids"].present? && params["ids"].is_a?(Array)
    topics = topics.where(user_id: params["user_ids"]) if params["user_ids"].present? && params["user_ids"].is_a?(Array)
    topics = topics.where(ancestry: params["ancestry"]&.empty? ? nil : params["ancestry"]) if params.include?("ancestry")
    topics = topics.where(slug: params["slug"]) if params["slug"]
    topics = topics.where(content: params["content"]) if params["content"]
    if params["reference"]
      topics = topics
        .where("lower(content) like ?", "%#{params['reference'].downcase}%")
        .or(topics.where("lower(content) like ?", "%[[#{params['reference'].downcase}]]%"))
    end
    limit = params["slug"] || (params["ids"] && params["ids"].size == 1) ? 1 : 100
    topics = topics.order(id: :desc).limit(limit)

    methods = []
    methods << :descendants if params[:include_descendants]
    methods << :ancestors if params[:include_ancestors]
    methods << :user if params[:include_user]
    render json: topics.to_json(methods: methods)
  end

  def show
    topics = Topic
    topics = topics.where(id: params[:id]) if params[:id]
    topics = topics.where(slug: params[:slug].downcase) if params[:slug]
    topic = topics.first

    if params[:include_descendants]
      render json: topic.to_json(methods: :descendants)
    else
      render json: topic
    end
  end

  def create
    args = params.permit(:content, :ancestry, :position, :slug).merge(user_id: current_user.id)
    topic = Topic.new(args)
    if topic.save
      render json: topic, status: :created
    else
      render json: topic.errors.full_messages, status: :bad_request
    end
  end

  def update
    updator = TopicUpdator.new(@topic)
    if updator.update(params.permit(:content, :ancestry, :position, :slug))
      render json: @topic, status: :ok
    else
      render json: @topic.errors.full_messages, status: :not_modified
    end
  end

  def destroy
    if @topic.destroy
      render json: @topic, status: :ok
    else
      render json: topic.errors.full_messages, status: :not_modified
    end
  end

  private

  def set_topic
    @topic = Topic.find(params[:id])
  end

  def authenticate_param_id!
    head :unauthorized if current_user.id != @topic.user_id
  end

  def authenticate_param_user_id!
    head :unauthorized if current_user.id.to_s != params[:user_id].to_s
  end
end
