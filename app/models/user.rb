class User < ActiveRecord::Base
  devise(
    *%i(
      database_authenticatable
      registerable
      recoverable
      rememberable
      trackable
      validatable
    )
  )

  enum(role: %i(student teacher admin))

  include DeviseTokenAuth::Concerns::User
end
