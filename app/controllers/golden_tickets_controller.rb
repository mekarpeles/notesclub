class GoldenTicketsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:check]

  def check
    success = params[:code].present? && GoldenTicket.where(code: params[:code]).exists?
    render json: { found: success }, status: :ok
  end
end
