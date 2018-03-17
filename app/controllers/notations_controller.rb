class NotationsController < ApplicationController
  def index
    @notations = Notation.includes(:tags, :transcriber)
    render(:index, status: 200)
  end

  def show
    @notation = Notation.includes(:tags, :transcriber).where(id: params.require(:id)).first!
    render(:show, status: 200)
  end
end
