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
    content_type: { content_type: %W(image/jpeg image/jpg image/gif image/png) },
    size: { in: 0..2.megabytes }
  )

  validate(:check_transcriber)

  accepts_nested_attributes_for(:video)

  private

    # Allow only teachers and admins to transcribe Notations
    def check_transcriber
      if %i(teacher admin).none? { |role| transcriber.has_role?(role) }
        errors.add(:transcriber, "must be a teacher or admin")
      end
    end
end
