class Topic < ApplicationRecord
  has_ancestry
  acts_as_list scope: [:ancestry, :user_id]

  belongs_to :user

  validates :slug, uniqueness: { scope: :user_id }, presence: true
  validates :id, uniqueness: true

  before_validation :set_content, on: [:create]
  before_validation :set_slug, on: [:create]
  before_save :nulify_empty_ancestry

  def as_json(options = {})
    json = super(options)
    methods = options[:methods] || []
    methods = [methods] if methods.is_a?(Symbol)
    if methods.include?(:user)
      json['user'] = self.user.slice(UsersController::EXPOSED_ATTRIBUTES)
    end
    json
  end

  private

  def set_content
    self.content = should_titleize? ? slug.titleize : slug if content.blank? && slug.present?
  end

  def should_titleize?
    month_regex = /\A[0-9]{4}-[0-9]{2}\z/         # E.g. 2020-09
    date_regex = /\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/ # E.g. 2020-09-10
    !month_regex.match(slug) && !date_regex.match(slug)
  end

  def set_slug
    self.slug = SlugGenerator.new(self).generate_unique_slug if slug.blank?
  end

  def nulify_empty_ancestry
    self.ancestry = nil if ancestry.blank?
  end
end
