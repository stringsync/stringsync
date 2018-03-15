class Notation < ApplicationRecord
  has_attached_file(:thumbnail)

  validates_attachment(:thumbnail,
    presence: true,
    content_type: { content_type: "image/jpeg" },
    size: { in: 0..2.megabytes }
  )
end
