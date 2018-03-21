ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

# Takes user object and their password, and returns headers we need for valid requests
# If testing multiple requests afterwards, you'll need to keep trak of changing headers
module SignInHelper
  def sign_in_as(user, password)
    post(user_session_path, params: { email: user.email, password: password }, as: :json)
    response.headers.slice("client", "uid", "access-token")
  end
end

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

class ActionController::TestCase
end

class ActionDispatch::IntegrationTest
  include SignInHelper
end
