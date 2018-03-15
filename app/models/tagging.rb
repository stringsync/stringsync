# This model is the join between notations and tags.
class Tagging < ApplicationRecord
  belongs_to(:notation)
  belongs_to(:tag)
end
