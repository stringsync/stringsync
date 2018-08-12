# This class is primarily used load the db/fixtures (not test/fixtures) when
# seeding or restoring the database.
class FixtureLoader
  FIXTURES_DIR = File.join(Rails.root, "db", "fixtures").freeze
  NOTATION_THUMBNAILS_DIR = File.join(FIXTURES_DIR, "images", "notation_thumbnails").freeze

  attr_accessor :memo

  def initialize
    self.memo = {}
  end

  def seed!
    ApplicationRecord.transaction do
      create_fixtures!(User)
      create_fixtures!(Tag)
      create_notations_and_videos!
      create_taggings!

      # Manually setting the ids does causes unexpected behavior with the auto increment coloumns
      [User, Tag, Notation, Video, Tagging].each do |model|
        id = model.maximum(:id) + 1
        
        ActiveRecord::Base.connection.execute(
          "ALTER SEQUENCE #{model.table_name}_id_seq RESTART WITH #{id}"
        )
      end
    end
  end

  private

    def instance(model, attrs)
      dup_attrs = attrs.dup
      id = dup_attrs.delete(:id)

      memo[model] ||= {}
      memo[model][id] = model.new(dup_attrs)
    end

    def create_fixtures!(model)
      load_yaml_for(model).each { |attrs| instance(model, attrs).save! }
    end

    # Due to the models validations and database constraints on notations and videos,
    # we need to create these records at the same time.
    def create_notations_and_videos!
      notation_attrs_by_id = load_yaml_for(Notation).index_by do |attrs|
        attrs.fetch("id")
      end

      video_attrs_by_notation_id = load_yaml_for(Video).index_by do |attrs|
        attrs.fetch("notation_id")
      end

      notation_attrs_by_id.each do |notation_id, notation_attrs|
        video = instance(Video, video_attrs_by_notation_id.fetch(notation_id))
        video.save(validate: false)

        begin
          thumbnail = load_notation_thumbnail(notation_attrs.fetch("thumbnail_file_name"))
          instance(Notation, notation_attrs.merge(video: video, thumbnail: thumbnail)).save!
        ensure
          thumbnail.close
        end
      end
    end

    def create_taggings!
      load_yaml_for(Tagging).each do |attrs|
        notation = memo[Notation][attrs.fetch("notation_id")]
        tag = memo[Tag][attrs.fetch("tag_id")]
        instance(Tagging, attrs).save!
      end
    end

    def load_yaml_for(model)
      YAML.load_file(File.join(FIXTURES_DIR, "#{model.to_s.downcase.pluralize}.yml"))
    end

    def load_notation_thumbnail(filename)
      File.open(File.join(NOTATION_THUMBNAILS_DIR, filename))
    end
end
