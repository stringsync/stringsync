# This model is the citadel of StringSync. It is used to store the instructions
# on how to sync a notation and video.
class Notation < ApplicationRecord
  DEFAULT_VEXTAB_STRING = "key=C time=4/4\n:1 ##".freeze

  belongs_to(:transcriber, foreign_key: :transcriber_id, class_name: "User")
  has_one(:video, inverse_of: :notation)
  has_many(:taggings, dependent: :destroy)
  has_many(:tags, through: :taggings)

  has_attached_file(:thumbnail, style: { thumbnail: "640x640" })

  validates(:transcriber, presence: true)

  validates_attachment(:thumbnail,
    presence: true,
    content_type: { content_type: %W(image/jpeg image/jpg image/gif image/png) },
    size: { in: 0..2.megabytes }
  )

  validate(:check_transcriber)

  before_create(:ensure_vextab_string!)

  accepts_nested_attributes_for(:video)

  private

    # Only allow teachers and admins to transcribe Notations
    def check_transcriber
      if %i(teacher admin).none? { |role| transcriber.try(:has_role?, role) }
        errors.add(:transcriber, "must be a teacher or admin")
      end
    end

    def ensure_vextab_string!
      self.vextab_string = DEFAULT_VEXTAB_STRING if vextab_string.blank?
    end
end
