class UsersController < ApplicationController
  before_action :authenticate_member!
end