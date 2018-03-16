class NotationsController < ApplicationController
  def index
    @notations = Notation.includes(:tags, :transcriber)
    render(:index, status: 200)
  end
end
