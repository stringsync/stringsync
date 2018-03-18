# This model keeps track of the video for notations. The reason why it is a separate model
# is to allow different kinds of video sources. For now, the only source kind is a youtube
# video, which requires only the youtube video ID to be stored.
class Video < ApplicationRecord
  belongs_to(:notation)

  enum(kind: %i(youtube))
end
