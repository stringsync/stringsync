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
