package router

import (
	"fmt"
	"net/http"
)

// Route contains data to match and handle a requested route.
type Route struct {
	method  string
	path    string
	handler http.Handler
}

// Matches returns whether or not the route matches the request.
func (r *Route) Matches(method, path string) bool {
	return r.method == method && r.path == path
}

// Validate computes errors with the route.
func (r *Route) Validate() error {
	if !isValidMethod(r.method) {
		return fmt.Errorf("route method must be an http verb, got %v", r.method)
	}
	if r.path == "" {
		return fmt.Errorf("route path cannot be empty")
	}
	if string(r.path[0]) != "/" {
		return fmt.Errorf("route path must begin with '/', got %v", r.path)
	}
	if len(r.path) > 1 && string(r.path[len(r.path)-1]) == "/" {
		return fmt.Errorf("route path cannot end in '/', got %v", r.path)
	}
	return nil
}

// isValidMethod validates that the method is a support HTTP verb.
func isValidMethod(method string) bool {
	switch method {
	case http.MethodGet:
		fallthrough
	case http.MethodPost:
		fallthrough
	case http.MethodPut:
		fallthrough
	case http.MethodPatch:
		return true
	}
	return false
}
