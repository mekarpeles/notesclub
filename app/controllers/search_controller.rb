class SearchController < ApplicationController
  def count
    if params['url'].present?
      topics = Topic.where("lower(content) like ?", "%#{params['url'].downcase}%")
      count = topics.count
    else
      count = 0
    end
    render json: count, status: :ok
  end
end
