package middleware

import (
	"net/http"
	"strings"
)

// Cors creates a middleware that allows the specified origins and methods.
func Cors(allowedOrigins []string, allowedMethods []string) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			headers := w.Header()

			origin := r.Header.Get("Origin")
			if includesIgnoringCase(origin, allowedOrigins) {
				headers.Add("Access-Control-Allow-Origin", strings.ToLower(origin))
			}

			method := r.Header.Get("Access-Control-Request-Method")
			if includesIgnoringCase(method, allowedMethods) {
				headers.Add("Access-Control-Allow-Methods", strings.ToUpper(method))
			}

			handler.ServeHTTP(w, r)
		})
	}
}

func includesIgnoringCase(needle string, haystack []string) bool {
	for _, candidate := range haystack {
		if strings.EqualFold(needle, candidate) {
			return true
		}
	}
	return false
}
