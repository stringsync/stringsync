json.links do
  json.partial! "users/links", user: @user
end
json.data do
  json.partial! "users/data", user: @user
end
