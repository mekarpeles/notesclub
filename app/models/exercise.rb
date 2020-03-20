class Exercise < ApplicationRecord
  NAMES = %w(KeyWordTransformation)
  belongs_to :created_by, class_name: "User"

  validate :data_format

  private

  def data_format
    begin
      klass = "Exercise::#{name}Validator".constantize
      validator = klass.new(data)
      validator.validate do |error, msg|
        errors.add(error, msg)
      end
    rescue NameError => e
      errors.add(:name, "must be one of these: #{NAMES.join(', ')}")
    end
  end
end
