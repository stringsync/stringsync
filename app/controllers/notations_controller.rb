class NotationsController < ApplicationController::API
  def index
    @notations = Notation.all
    render(json: @notations.to_json, status: 200)
  end
end
