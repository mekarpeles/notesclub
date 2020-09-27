creds = Aws::Credentials.new(ENV['AWS_SES_SMTP_USERNAME'], ENV['AWS_SES_SMTP_PASSWORD'])
Aws::Rails.add_action_mailer_delivery_method(
  :ses,
  credentials: creds,
  region: 'eu-central-1'
)
