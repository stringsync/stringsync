json.partial! "videos/identifier", video: video
json.attributes do
  json.partial! "videos/attributes", video: video
end
json.links do
  json.partial! "videos/links", video: video
end
