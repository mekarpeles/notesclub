class Topic::ContentSlugGenerator
  def initialize(content)
    @content = content
  end

  def generate
    content.parameterize(separator: "_")[0..99]
  end

  private
  attr_reader :content
end
