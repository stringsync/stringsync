json.links do
  json.partial! "notations/links", notation: nil
end
json.data(@notations) do |notation|
  json.partial! "notations/data", notation: notation
end
json.included do
  json.partial! "tags/as_included", collection: @notations.flat_map(&:tags).uniq, as: :tag
  json.partial! "users/as_included", collection: @notations.map(&:transcriber).uniq, as: :user
end
