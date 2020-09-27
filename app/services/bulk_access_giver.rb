# Give access to n waiting users
class BulkAccessGiver
  attr_reader :errors

  def initialize(n)
    @n = n
  end

  def give_access
    @errors = []
    WaitingUser.where("golden_ticket_id is null").order(id: :asc).limit(n).find_each do |waiting_user|
      success = WaitingUserAccessGiver.new(waiting_user).give_access
      @errors << waiting_user unless success
    end
    @errors.empty?
  end

  private

  attr_reader :n
end
