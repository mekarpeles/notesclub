class TopicDeleter
  def initialize(topic, args = {})
    @topic = topic
    @include_descendants = args[:include_descendants] || true
  end

  def delete
    Topic.transaction do
      delete_descendants if include_descendants
      topic.destroy!
    end
    true
  rescue  ActiveRecord::RecordNotDestroyed => e
    false
  end

  private

  attr_reader :topic, :include_descendants

  # We use delete_all instead of each{|t| t.destroy!} because at the moment:
  # - we don't have before_* or after_destroy methods
  # - we do not have associations dependant on this
  def delete_descendants
    topic.descendants.delete_all
  end
end
