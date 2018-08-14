details = "something went wrong" unless defined?(details)
json.errors [status: response.status, details: details]
