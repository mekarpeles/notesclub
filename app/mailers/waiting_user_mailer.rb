class WaitingUserMailer < ApplicationMailer
  def access_email
    @waiting_user = params[:waiting_user]
    @golden_ticket = @waiting_user.golden_ticket
    @signup_url = "https://book.notes.club/signup"
    mail(to: @waiting_user.email, subject: "Book Notes Club access code")
  end
end
