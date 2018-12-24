
class NotationsController < ApplicationController
  def index
    filter = params.fetch("filter", "featured").to_sym

    case filter
    when :all
      @notations = Notation.includes(:tags, :transcriber, :video)
    when :featured
      @notations = Notation.includes(:tags, :transcriber, :video).where(featured: true)
    else
      @notations = Notation.none
    end

    if authorized?(filter)
      render(:index, status: 200)
    else
      render("shared/errors", status: 401)
    end
  end

  def show
    @notation = Notation.includes(:tags, :transcriber, :video).where(id: params.require(:id)).first!
    render(:show, status: 200)
  end

  def create
    # if current_user.try(:has_role?, :teacher)
    if true
      @notation = Notation.new(notation_params.except("tag_ids").merge(transcriber: current_user))
      @notation.tags = Tag.where(id: params.fetch(:notation).fetch(:tag_ids))

      if @notation.save
        render(:show, status: 200)
      else
        render("shared/errors", status: 422)
      end
    else
      render("shared/errors", status: 401, locals: { details: "Must be a teacher to upload" })
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
    if current_user.try(:has_role?, :admin)
      @notation = Notation.
          includes(:tags, :video, :transcriber).
          where(id: params.require(:id)).
          first!

      @notation.destroy!
      render(:show, status: 200)
    else
      render("shared/errors", status: 401)
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

    def authorized?(filter)
      case filter
      when :all
        !!current_user.try(:has_role?, :admin)
      when :featured
        true
      else
        false
      end
    end
end
