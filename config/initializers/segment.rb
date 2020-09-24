if ENV['NOTES_SEGMENT_ENABLED'].to_s == "true"
  Analytics = Segment::Analytics.new({
    write_key: ENV['NOTES_SEGMENT_KEY'],
    on_error: Proc.new { |status, msg| print msg }
  })
end
