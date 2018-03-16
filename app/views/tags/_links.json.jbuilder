if defined?(tag)
  json.self tag_path(tag)
else
  json.self tags_path
end
