class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User

  devise(*%i(database_authenticatable registerable recoverable rememberable trackable validatable))

  # The purpose of roles is to determine if the user is allowed to perform certain actions.
  # The order of role declaration matters. Each role can be considered the same as all the
  # roles preceding it.
  enum(role: %i(student teacher admin))

  has_many(:transcribed_notations, foreign_key: :transcriber_id, class_name: "Notation")

  before_create { skip_confirmation! }

  def has_role?(role)
    roles = self.class.roles
    roles.fetch(self.role) >= roles.fetch(role.to_s)
  end
end
