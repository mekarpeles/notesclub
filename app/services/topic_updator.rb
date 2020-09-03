class TopicUpdator
  def initialize(topic)
    @topic = topic
  end

  def update(args)
    Topic.transaction do
      topic.update!(args)
      create_new_topics_from_links!
    end
    true
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error("Error updating topic #{topic.inspect}\nparams: #{args.inspect}\n#{e.message}\n#{e.backtrace.join("\n")}")
    false
  end

  private
  attr_reader :topic

  def create_new_topics_from_links!
    topic.content.split(/\[\[([^\[]*)\]\]/).each_with_index do |content, index|
      create_new_topic!(content) if link_to_topic?(index) && !root_topic_exists?(content)
    end
  end

  def create_new_topic!(content)
    Topic.create!(content: content, ancestry: nil, user_id: topic.user_id)
  end

  def root_topic_exists?(content)
    Topic.where(content: content, ancestry: nil, user_id: topic.user_id).exists?
  end

  def link_to_topic?(index)
    index % 2 == 1
  end
end
