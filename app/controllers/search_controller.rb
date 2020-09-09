class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: [:count]

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
end
