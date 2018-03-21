require 'test_helper'

class NotationTest < ActiveSupport::TestCase
  test "only allow teachers and admins to be the transcriber for a notation" do
    msg = "must be a teacher or admin"

    # allowed users
    users(:admin1, :teacher1).each do |user|
      notation = Notation.new(transcriber: user)
      notation.validate
      refute_includes(notation.errors[:transcriber], msg)
    end

    # not allowed user
    notation = Notation.new(transcriber: users(:student1))
    notation.validate
    assert_includes(notation.errors[:transcriber], msg)
  end
end
