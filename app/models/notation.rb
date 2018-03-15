# This model is the citadel of StringSync. It is used to store the instructions
# on how to sync a notation and video.
class Notation < ApplicationRecord
  belongs_to(:transcriber, foreign_key: :transcriber_id, class_name: "User")
  has_one(:video)
  has_many(:taggings, dependent: :destroy)
  has_many(:tags, through: :taggings)

  has_attached_file(:thumbnail, style: { thumbnail: "640x640" })

  validates_attachment(:thumbnail,
    presence: true,
    content_type: { content_type: "image/jpeg" },
    size: { in: 0..2.megabytes }
  )
end
