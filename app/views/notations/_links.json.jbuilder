if defined?(notation)
  json.self notation_path(notation)
else
  json.self notations_path
end
