class Topic::SlugGenerator
  BYTES_NUMBER = 15

  def initialize(topic)
    @topic = topic
  end

  def generate_unique_slug
    if topic.ancestry.nil?
      generate_unique_slug_from_content
    else
      generate_unique_random_slug
    end
  end

  private

  attr_reader :topic

  def generate_unique_slug_from_content
    new_slug = generate_slug_from_content
    while another_topic_with_slug?(new_slug)
      new_slug = "#{new_slug}#{SecureRandom.urlsafe_base64(1).downcase}"
    end
    new_slug
  end

  def generate_unique_random_slug
    new_slug = nil
    loop do
      new_slug = SecureRandom.urlsafe_base64(BYTES_NUMBER).downcase
      break unless another_topic_with_slug?(new_slug)
    end
    new_slug
  end

  def another_topic_with_slug?(new_slug)
    t = Topic.where(slug: new_slug, user_id: topic.user_id)
    t = t.where.not(id: topic.id) if topic.id
    t.exists?
  end

  def generate_slug_from_content
    topic.content[0..99].parameterize(separator: "_")
  end
end
