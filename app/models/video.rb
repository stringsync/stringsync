# This model keeps track of the video for notations. The reason why it is a separate model
# is to allow different kinds of video sources. For now, the only source kind is a youtube
# video, which requires only the youtube video ID to be stored.
class Video < ApplicationRecord
  YOUTUBE_ID_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,})/.freeze

  belongs_to(:notation, dependent: :destroy)

  enum(kind: %i(youtube))

  before_save(:extract_src)

  private

    def extract_src
      case kind.to_sym
      when :youtube
        match = src.try(:match, YOUTUBE_ID_REGEX)
        self.src = match[1] if match.present?
      end
    end
end
