json.errors(@user.errors.messages) do |title, detail|
  json.status response.status
  json.title title
  json.detail detail
end
