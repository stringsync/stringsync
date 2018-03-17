json.links do
  json.partial! "notations/links", notation: @notation
end
json.data do
  json.partial! "notations/data", notation: @notation
end
json.included do
  json.partial! "tags/as_included", collection: @notation.tags, as: :tag
  json.partial! "users/as_included", collection: [@notation.transcriber], as: :user
end
