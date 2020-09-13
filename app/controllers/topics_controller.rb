class TopicsController < ApplicationController
  before_action :set_topic, only: [:update, :destroy]
  before_action :authenticate_param_id!, only: [:update, :destroy]
  before_action :authenticate_param_user_id!, only: [:create]
  skip_before_action :authenticate_user!, only: [:count]

  def index
    track_topic if params["user_ids"] && params["user_ids"].is_a?(Array) && params["user_ids"].size == 1
    topics = Topic
    topics = topics.where(id: params["ids"]) if params["ids"].present? && params["ids"].is_a?(Array)
    topics = topics.where(user_id: params["user_ids"]) if params["user_ids"].present? && params["user_ids"].is_a?(Array)
    topics = topics.where(ancestry: params["ancestry"]&.empty? ? nil : params["ancestry"]) if params.include?("ancestry")
    topics = topics.where(slug: params["slug"]) if params["slug"]
    topics = topics.where(content: params["content"]) if params["content"]
    if params["content_like"]
      topics = topics.where("lower(content) like ?", params['content_like'].downcase)
    end
    if params["except_ids"].present?
      topics = topics.where.not(id: params["except_ids"])
    end
    if params["id_lte"].present?
      topics = topics.where("topics.id <= ?", params["id_lte"])
    end
    if params["id_gte"].present?
      topics = topics.where("topics.id >= ?", params["id_gte"])
    end
    if params["except_slug"].present?
      topics = topics.where.not(slug: params["except_slug"])
    end
    if params["skip_if_no_descendants"]
      topics = topics.joins("inner join topics as t on t.ancestry = cast(topics.id as VARCHAR(255)) and t.position=1 and t.content != ''")
    end
    limit = params["limit"] ? [params["limit"].to_i, 100].min : 100
    limit = 1 if params["slug"] || (params["ids"] && params["ids"].size == 1)
    topics = topics.order(id: :desc).limit(limit)
    methods = []
    methods << :descendants if params[:include_descendants]
    methods << :ancestors if params[:include_ancestors]
    methods << :user if params[:include_user]
    render json: topics.to_json(methods: methods)
  end

  def count
    if params['url'].present?
      url = params['url'].downcase
      # We count all non-root topics (ancestry != nil):
      count1 = Topic.
        where("lower(content) like ?", "%#{url}%").
        where("ancestry is not null").limit(10).count
      # We also count root topics with a first child where content is not empty:
      count2 = Topic.
        joins("inner join topics as t on t.ancestry = cast(topics.id as VARCHAR(255)) and t.position=1 and t.content != ''").
        where("topics.ancestry is null").
        where("lower(topics.content) like ?", "%#{url}%").limit(10).count
      count = [count1 + count2, 10].min
    else
      count = 0
    end
    render json: count, status: :ok
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
    args = params.require(:topic).permit(:content, :ancestry, :position, :slug).merge(user_id: current_user.id)
    topic = Topic.new(args)
    if topic.save
      track_action("Create topic", topic_id: topic.id)
      methods = []
      methods << :descendants if params[:include_descendants]
      methods << :ancestors if params[:include_ancestors]
      methods << :user if params[:include_user]
      render json: topic.to_json(methods: methods), status: :created
    else
      render json: topic.errors.full_messages, status: :bad_request
    end
  end

  def update
    updator = TopicUpdator.new(@topic, params[:update_topics_with_links])
    if updator.update(params.require(:topic).permit(:content, :ancestry, :position, :slug))
      track_action("Update topic", topic_id: @topic.id)
      render json: @topic, status: :ok
    else
      render json: @topic.errors.full_messages, status: :not_modified
    end
  end

  def destroy
    destroyer = TopicDeleter.new(@topic, include_descendants: true)
    if destroyer.delete
      track_action("Delete topic")
      render json: @topic, status: :ok
    else
      Rails.logger.error("Error deleting topic #{@topic.inspect} - params: #{params.inspect}")
      render json: { errors: "Couldn't delete topic or descendants" }, status: :not_modified
    end
  end

  private

  def track_topic
    id = params["user_ids"].first
    blogger = User.find_by(id: id)
    if params["slug"]
      track_action("Get topic", { blog_username: blogger.username, topic_slug: params['slug'], blogger_id: blogger.id })
    else
      track_action("Get user topics", { blog_username: blogger.username, blogger_id: blogger.id })
    end
  end

  def set_topic
    @topic = Topic.find(params[:id])
  end

  def authenticate_param_id!
    head :unauthorized if current_user.id != @topic.user_id
  end

  def authenticate_param_user_id!
    head :unauthorized if !params[:topic] || current_user.id.to_s != params[:topic][:user_id].to_s
  end
end
