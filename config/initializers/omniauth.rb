Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Rails.application.secrets.facebook_api_id!, Rails.application.secrets.facebook_secret!
end
