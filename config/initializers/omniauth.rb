Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Rails.application.secrets.facebook_api_id!, Rails.application.secrets.facebook_secret!
  provider :google_oauth2, Rails.application.secrets.google_client_id!, Rails.application.secrets.google_secret!
end
