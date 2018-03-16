if defined?(user)
  json.self user_path(user)
else
  json.self users_path
end
