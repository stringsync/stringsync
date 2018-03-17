json.links do
  json.partial! "tags/links", tag: nil
end
json.data(@tags) do |tag|
  json.partial! "tags/data", tag: tag
end
