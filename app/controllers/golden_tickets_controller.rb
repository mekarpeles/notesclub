class GoldenTicketsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:check]

  def check
    success = params[:code].present? && GoldenTicket.where(code: params[:code]).exists?
    if verify_recaptcha
      render json: { found: success }, status: :ok
    else
      render json: { errors: "Are you human? If so, please refresh and try again." }, status: :unauthorized
    end
  end
end
