class PingController < ApplicationController
  skip_before_action :authenticate_user!

  def ping
    render json: "pong".to_json
  end
end
