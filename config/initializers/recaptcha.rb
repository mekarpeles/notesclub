Recaptcha.configure do |config|
  config.secret_key = ENV['NOTESCLUB_RECAPTCHA_SECRET']
end
