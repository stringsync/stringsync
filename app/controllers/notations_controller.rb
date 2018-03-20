class NotationsController < ApplicationController
  def index
    @notations = Notation.includes(:tags, :transcriber, :video)
    render(:index, status: 200)
  end

  def show
    @notation = Notation.includes(:tags, :transcriber, :video).where(id: params.require(:id)).first!
    render(:show, status: 200)
  end

  def create
    if current_user.try(:has_role?, :teacher)
      @notation = Notation.new(notation_params.merge(transcriber: current_user))

      if @notation.save
        render(:show, status: 200)
      else
        render("shared/errors", status: 422)
      end
    else
      render("shared/errors", status: 401)
    end
  end

  def update
    @notation = Notation.includes(:tags, :transcriber, :video).where(id: params.require(:id)).first!
    
    if current_user == @notation.transcriber || current_user.try(:has_role?, :admin)
      if @notation.update(notation_params)
        render(:show, status: 200)
      else
        render("shared/errors", status: 422)
      end
    else
      render("shared/errors", status: 401)
    end
  end

  def destroy
    @notation = Notation.includes(:tags, :transcriber).where(id: params.require(:id)).first!

    if current_user.try(:has_role?, :admin)
      @notation.destroy!
      render(:show, status: 200)
    else
      render("shared/errors")
    end
  end

  private

    def notation_params
      params.
          require(:notation).
          permit(*%i(
              song_name
              artist_name
              vextab_string
              bpm
              dead_time_ms
              duration_ms
              thumbnail
            ),
            video_attributes: %i(src kind)
          )
    end
end
