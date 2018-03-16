json.links do
  json.partial! "notations/links"
end
json.data do
  json.array! @notations do |notation|
    json.partial! "notations/identifier", notation: notation
    json.attributes do
      json.partial! "notations/attributes", notation: notation
    end
    json.relationships do
      json.tags do
        json.data do
          json.partial! "tags/identifier", collection: notation.tags, as: :tag
        end
      end
      json.transcriber do
        json.data do
          json.partial! "users/identifier", user: notation.transcriber
        end
      end
    end
    json.links do
      json.partial! "notations/links", notation: notation
    end
  end
end
json.included do
  json.partial! "tags/included", collection: @notations.flat_map(&:tags).uniq, as: :tag
  json.partial! "users/included", collection: @notations.map(&:transcriber).uniq, as: :user
end
