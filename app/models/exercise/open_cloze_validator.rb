class Exercise::OpenClozeValidator < Exercise::Validator
  def validate
    if data.is_a?(Hash)
      %w(title description text).each do |field|
        validate_object(field, String, &Proc.new)
      end
      validate_array_of_array_of_strings("solutions", &Proc.new)
      text = data["text"]
      if text.present? && text.is_a?(String)
        text = text + " " if gap_at_the_end?(text) # We add a space so split count the gap at the end.
        n_gaps = text.split(/\.{5}/).size - 1
        n_solutions = data["solutions"].size
        yield(:data, "You must have at least one gap.") if n_gaps == 0
        yield(:data, "You must have #{n_gaps} solutions (instead of #{n_solutions}) as you have #{n_gaps} gaps.") if n_solutions != n_gaps
      end
    else
      yield(:data, "must be a JSON hash")
    end
  end

  private

  def gap_at_the_end?(text)
    text[-5..-1] == "....."
  end
end
