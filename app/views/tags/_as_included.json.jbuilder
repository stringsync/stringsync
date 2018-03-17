json.partial! "tags/identifier", tag: tag
json.attributes do
  json.partial! "tags/attributes", tag: tag
end
json.links do
  json.partial! "tags/links", tag: tag
end
