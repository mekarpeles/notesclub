class UserCreator
  attr_reader :user, :errors

  def initialize(args)
    @name = args[:name]
    @username = args[:username]
    @email = args[:email]
    @password = args[:password]
    @golden_ticket_code = args[:golden_ticket_code]
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
  attr_reader :name, :username, :email, :password, :golden_ticket_code

  def create_user
    @errors = []
    @user = User.new(args)
    User.transaction do
      @user.save!
      golden_ticket.destroy!
      t = @user.topics.create!(content: "Welcome to wikir", user: @user)
      t.children.create!(content: "We're thrilled to have you here.", user: @user)
      t.children.create!(content: "This is your personal but social wiki.", user: @user)
      t.children.create!(content: "Everything you write here is open to all Wikir users.", user: @user)
      t.children.create!(content: "Click on any block of text to edit it.", user: @user)
      t.children.create!(content: "You can create and link [[topics]] enclosing any text between two square brackets. E.g. [[Books]]", user: @user)
      t2 = t.children.create!(content: "When you are in edit mode you can:", user: @user)
      t2.children.create!(content: "Press Enter to create a new block below", user: @user)
      t2.children.create!(content: "Press Arrow Up to select the block above", user: @user)
      t2.children.create!(content: "Press Arrow Down to select the block below", user: @user)
      t2.children.create!(content: "Press Tab to indent blocks", user: @user)
      t2.children.create!(content: "Press Shift + Tab to unindent blocks", user: @user)
      t3 = t2.children.create!(content: "Press Alt + Click on any block to open the block in a new url. Actually, any block is a topic on its own!", user: @user)
      t2.children.create!(content: "Press Shift + Arrow Up to move the current block up", user: @user)
      t2.children.create!(content: "Press Shift + Arrow Down to move the current block down", user: @user)
      t2.children.create!(content: "Press Esc to leave edit mode (and save changes)", user: @user)
      t.children.create!(content: "Below your changes, you'll see references from other of your topics and from other users' topics", user: @user)
      today = Time.now.strftime("%Y-%m-%d")
      t.children.create!(content: "Also, you can go to today's topic ([[#{today}]]) and add some content. Whenever you don't know where to add something, you can do it in a topic for the current date.", user: @user)
      t3 = t.children.create!(content: "Last, you can also install our Chrome Extension https://chrome.google.com/webstore/detail/wikir/gifmjjjggghkppgeblekdopigpkbipii", user: @user)
      t4 = t3.children.create!(content: "Click our chrome extensions' icon to:", user: @user)
      t4.children.create!(content: "annotate the website you have open", user: @user)
      t4.children.create!(content: "see the existent comments and content regarding the website you have open", user: @user)
      t3.children.create!(content: "Our chrome extension's icon displays the number of occurrences of the current website on Wikir.", user: @user)
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
      username: username,
      email: email,
      password: password,
      password_confirmation: password,
      invited_by_id: golden_ticket.user_id
    }
  end

  def golden_ticket
    @golden_tiken ||= GoldenTicket.where(code: golden_ticket_code).first
  end
end
