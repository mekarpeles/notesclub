class Exercise::Validator < ActiveModel::Validator
  def initialize(json_data)
    @json_data = json_data || "null"
  end

  def validate
    raise "not implemented"
  end

  private

  def validate_array_of_objects(field, klass)
    value = data[field]
    obj_names = klass.to_s.downcase.pluralize
    if value.blank? || (value.is_a?(Array) && value.any?{|s| s.blank?})
      yield(:data, "#{field} can't be blank.") if block_given?
      false
    elsif value && (!value.is_a?(Array) || value.any?{|s| !s.is_a?(klass)})
      yield(:data, "#{field} must be an array of #{obj_names}") if block_given?
      false
    else
      true
    end
  end

  def validate_array_of_array_of_objects(field, klass)
    arrays_of_arrays = data[field]
    obj_names = klass.to_s.downcase.pluralize
    if arrays_of_arrays.nil?
      yield(:data, "#{field} can't be blank.") if block_given?
      false
    elsif !arrays_of_arrays.is_a?(Array) || arrays_of_arrays.any?{|v| !v.is_a?(Array)} || arrays_of_arrays.any?{|v| v.any?{|s| !s.is_a?(klass)}}
      yield(:data, "#{field} must be an array of arrays of #{klass}.") if block_given?
      false
    else
      true
    end
  end

  def validate_array_of_array_of_strings(field)
    result = validate_array_of_array_of_objects(field, String, &Proc.new)
    values = data[field]
    if result && values.any?{|v| v.any?{|s| s.blank?}}
      yield(:data, "#{field} can't be empty.") if block_given?
      false
    else
      true
    end
  end

  def validate_object(field, klass)
    obj_name = klass.to_s.downcase
    if data[field].blank?
      yield(:data, "#{field} can't be blank.") if block_given?
      false
    elsif data[field] && !data[field].is_a?(klass)
      yield(:data, "#{field} must be a #{obj_name}.") if block_given?
      false
    else
      true
    end
  end

  def data
    @data ||= JSON.parse(@json_data)
  end
end
