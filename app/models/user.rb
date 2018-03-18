class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User

  devise(*%i(database_authenticatable registerable recoverable rememberable trackable validatable))

  # The purpose of roles is to determine if the user is allowed to perform certain actions.
  # The order of role declaration matters. Each role can be considered the same as all the
  # roles preceding it.
  enum(role: %i(student teacher admin))

  def self.omniauth_for(auth)

  end

  def has_role?(role)
    roles = self.class.roles
    roles.fetch(role.to_s) >= roles.fetch(self.role)
  end
end
