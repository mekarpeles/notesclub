class TopicUpdator
  def initialize(topic, update_topics_with_links = false)
    @topic = topic
    @update_topics_with_links = update_topics_with_links
    @original_content = topic.content
  end

  def update(args)
    args[:slug] = Topic::ContentSlugGenerator.new(args[:content]).generate if args[:content].present? && args[:ancestry].nil?
    Topic.transaction do
      topic.update!(args)
      create_new_topics_from_links!
      update_topics_with_links! if update_topics_with_links
    end
    true
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error("Error updating topic #{topic.inspect}\nparams: #{args.inspect}\n#{e.message}\n#{e.backtrace.join("\n")}")
    false
  end

  private
  attr_reader :topic, :update_topics_with_links, :original_content

  def create_new_topics_from_links!
    topic.content.split(/\[\[([^\[]*)\]\]/).each_with_index do |content, index|
      link_to_other_user = content.match(/^([^\s:]+):(.*)/)
      create_new_topic!(content) if !link_to_other_user && link_to_topic?(index) && !root_topic_exists?(content)
    end
  end

  def update_topics_with_links!
    orig_cont = Regexp.escape(original_content)
    cont = topic.content
    Topic.
      where.not(id: topic.id).
      where(user_id: topic.user_id).
      where("content like ?", "%[[#{orig_cont}]]%").find_each do |t|
        t.update!(content: t.content.gsub(/\[\[#{orig_cont}\]\]/, "[[#{cont}]]"))
    end
  end

  def create_new_topic!(content)
    Topic.create!(content: content, ancestry: nil, user_id: topic.user_id)
  end

  def root_topic_exists?(content)
    slug = Topic::ContentSlugGenerator.new(content).generate
    Topic.where(slug: slug, ancestry: nil, user_id: topic.user_id).exists?
  end

  def link_to_topic?(index)
    index % 2 == 1
  end
end
