class Exercise::KeyWordTransformationValidator < ActiveModel::Validator
  def initialize(json_data)
    @json_data = json_data || "null"
  end

  def validate
    if data.is_a?(Hash)
      validate_array_of_objects("solutions", String, &Proc.new)
      %w(title description originalSentence part1 part2 word).each do |field|
        validate_object(field, String, &Proc.new)
      end
    else
      yield(:data, "must be a JSON hash")
    end
  end

  private

  def validate_array_of_objects(field, klass)
    value = data[field]
    obj_names = klass.to_s.downcase.pluralize
    yield(:data, "must include #{field} (array of #{obj_names})") if value.blank?
    yield(:data, "#{field} must be an array of #{obj_names})") if value && (!value.is_a?(Array) || value.any?{|s| !s.is_a?(klass) || s.blank?})
  end

  def validate_object(field, klass)
    obj_name = klass.to_s.downcase
    yield(:data, "#{field} can't be blank.") if data[field].blank?
    yield(:data, "#{field} must be a #{obj_name}.") if data[field] && !data[field].is_a?(klass)
  end

  def data
    @data ||= JSON.parse(@json_data)
  end
end
