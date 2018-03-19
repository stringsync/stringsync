require 'test_helper'

class NotationsControllerTest < ActionDispatch::IntegrationTest
  test "NotationsController#index" do
    response = get(notations_url)
    assert_response(:success)
  end
end
