class TagsController < ApplicationController
  def index
    @tags = Tag.all
    render(:index, status: 200)
  end
end
