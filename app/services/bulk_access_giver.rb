# Give access to n waiting users
class BulkAccessGiver
  attr_reader :errors

  def initialize(n)
    @n = n
  end

  def give_access
    @errors = []
    i = 0
    WaitingUser.where("golden_ticket_id is null").order(id: :asc).limit(n).find_each do |waiting_user|
      success = WaitingUserAccessGiver.new(waiting_user).give_access
      i += 1 if success
      @errors << waiting_user unless success
    end
    i
  end

  private

  attr_reader :n
end
