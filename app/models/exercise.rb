class Exercise < ApplicationRecord
  NAMES = %w(OpenCloze KeyWordTransformation)
  belongs_to :created_by, class_name: "User"

  validate :data_format

  private

  def data_format
    begin
      klass = "Exercise::#{name}Validator".constantize
    rescue => e
      Rails.logger.error("Tried to validate an exercise with name: #{name}")
      errors.add(:name, "must be one of these: #{NAMES.join(', ')}")
    end
    if klass
      validator = klass.new(data)
      validator.validate do |error, msg|
        errors.add(error, msg)
      end
    end
  end
end
