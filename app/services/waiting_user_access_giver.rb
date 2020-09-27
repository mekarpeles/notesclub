class WaitingUserAccessGiver
  def initialize(waiting_user)
    @waiting_user = waiting_user
  end

  def give_access
    return false if waiting_user.golden_ticket.present?

    golden_ticket = GoldenTicket.new(waiting_user: waiting_user)
    golden_ticket.set_unique_code
    golden_ticket.save
    if golden_ticket.save
      WaitingUserMailer.with(waiting_user: waiting_user).access_email.deliver_now
      true
    else
      Rails.logger.error "Error creating a Golden Ticket #{golden_ticket.errors.full_messages}"
      false
    end
  end

  private

  attr_reader :waiting_user
end
