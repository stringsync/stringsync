# This class is primarily used load the db/fixtures (not test/fixtures) when
# seeding or restoring the database.
class FixtureLoader
  FIXTURES_DIR = File.join(Rails.root, "db", "fixtures").freeze
  NOTATION_THUMBNAILS_DIR = File.join(FIXTURES_DIR, "images", "notation_thumbnails").freeze

  def seed!
    ApplicationRecord.transaction do
      create_fixtures!(User)
      create_fixtures!(Tag)
      create_notations_and_videos!
      create_fixtures!(Tagging)
    end
  end

  private

    def create_fixtures!(model)
      load_yaml_for(model).each(&model.method(:create!))
    end

    def create_notations_and_videos!
      notation_attrs_by_id = load_yaml_for(Notation).index_by do |attrs|
        attrs.fetch("id")
      end

      video_attrs_by_notation_id = load_yaml_for(Video).index_by do |attrs|
        attrs.fetch("notation_id")
      end

      notation_attrs_by_id.each do |notation_id, notation_attrs|
        video = Video.new(video_attrs_by_notation_id.fetch(notation_id))

        begin
          thumbnail = load_notation_thumbnail(notation_attrs.fetch("thumbnail_file_name"))
          Notation.create!(notation_attrs.merge(video: video, thumbnail: thumbnail))
        ensure
          thumbnail.close
        end
      end
    end

    def load_yaml_for(model)
      YAML.load_file(File.join(FIXTURES_DIR, "#{model.to_s.downcase.pluralize}.yml"))
    end

    def load_notation_thumbnail(filename)
      File.open(File.join(NOTATION_THUMBNAILS_DIR, filename))
    end
end
