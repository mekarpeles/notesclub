class UserCreator
  attr_reader :user, :errors

  def initialize(args)
    @name = args[:name]
    @username = args[:username]
    @email = args[:email]
    @password = args[:password]
    @golden_ticket_code = args[:golden_ticket_code]
    @marketing = args[:marketing]
  end

  def create
    if golden_ticket.present?
      create_user
    else
      @errors = ["Golden ticket not present"]
      false
    end
  end

  private
  attr_reader :name, :username, :email, :password, :golden_ticket_code, :marketing

  def create_user
    @errors = []
    @user = User.new(args)
    User.transaction do
      @user.save!
      golden_ticket.destroy!
    end
    true
  rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotDestroyed => e
    Rails.logger.info "Couldn't create a user: #{user.inspect}\n#{golden_ticket.inspect}\n#{e.message}\n#{e.backtrace.join("\n")}"
    @errors = @errors + @user.errors.full_messages if @user.errors.any?
    @errors = @errors + golden_ticket.errors.full_messages if golden_ticket.errors.any?
    false
  end

  def args
    {
      name: name,
      username: username.downcase,
      email: email,
      password: password,
      password_confirmation: password,
      invited_by_id: golden_ticket.user_id,
      marketing: marketing
    }
  end

  def golden_ticket
    @golden_tiken ||= GoldenTicket.where(code: golden_ticket_code).first
  end
end
