json.links do
  json.partial! "notations/links"
end
json.data do
  json.array! @notations do |notation|
    json.partial! "notations/data", notation: notation
  end
end
json.included do
  json.partial! "tags/as_included", collection: @notations.flat_map(&:tags).uniq, as: :tag
  json.partial! "users/as_included", collection: @notations.map(&:transcriber).uniq, as: :user
end
