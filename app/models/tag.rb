# This model is used to group notations that have the same tag.
class Tag < ApplicationRecord
  has_many(:taggings, dependent: :destroy)
  has_many(:notations, through: :taggings)

  validates(:name, presence: true)
  validates(:name, uniqueness: true)
end
