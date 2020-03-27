class Exercise::KeyWordTransformationValidator < Exercise::Validator
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
end
