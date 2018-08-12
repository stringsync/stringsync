details = "Something went wrong" unless defined?(details)
json.errors [status: response.status, details: details]
