json.partial! "users/identifier", user: user
json.attributes do
  json.partial! "users/attributes", user: user
end
json.links do
  json.partial! "users/links", user: user
end
