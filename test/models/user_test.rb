require 'test_helper'

class NotationTest < ActiveSupport::TestCase
  test "#has_role?" do
    users(:admin, :teacher, :student).each do |user|
      ndx = User.roles.fetch(user.role)
      has_roles, rest_roles = User.roles.partition { |_, precedence| ndx >= precedence }

      has_roles.map(&:first).each { |role| assert(user.has_role?(role)) }
      rest_roles.map(&:first).each { |role| refute(user.has_role?(role)) }
    end
  end
end
