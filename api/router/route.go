package router

import "net/http"

// Route contains data to match and handle a requested route.
type Route struct {
	method  string
	path    string
	handler http.Handler
}

// Matches returns whether or not the route matches the request.
func (route *Route) Matches(method, path string) bool {
	return route.method == method && route.path == path
}
