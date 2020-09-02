class Topic < ApplicationRecord
  has_ancestry
  acts_as_list scope: [:ancestry, :user_id]

  belongs_to :user

  validates :slug, uniqueness: { scope: :user_id }, presence: true
  validates :id, uniqueness: true

  before_validation :set_content, on: [:create]
  before_validation :set_slug, on: [:create], unless: :slug
  before_save :nulify_empty_ancestry

  def as_json(options = {})
    json = super(options)
    json['user'] = self.user.slice(UsersController::EXPOSED_ATTRIBUTES)
    json
  end

  private

  def set_content
    self.content = slug.titleize if content.blank? && slug.present?
  end

  def set_slug
    self.slug = SlugGenerator.new(self).generate_unique_slug
  end

  def nulify_empty_ancestry
    self.ancestry = nil if ancestry.blank?
  end
end
