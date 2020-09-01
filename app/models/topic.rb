class Topic < ApplicationRecord
  has_ancestry
  acts_as_list scope: [:ancestry, :user_id]

  validates :slug, uniqueness: { scope: :user_id }, presence: true
  validates :id, uniqueness: true

  before_validation :set_slug, on: [:create]
  before_save :nulify_empty_ancestry

  private

  def set_slug
    self.slug = SlugGenerator.new(self).generate_unique_slug
  end

  def nulify_empty_ancestry
    self.ancestry = nil if ancestry.blank?
  end
end
