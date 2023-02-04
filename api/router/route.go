package router

import (
	"fmt"
	"net/http"
	"strings"
)

// Route contains data to match and handle a requested route.
type Route struct {
	method  string
	path    string
	handler http.Handler
}

// RouteMatch contains data about a matched route.
type RouteMatch struct {
	RouteParams Params
}

// NewRouteMatch creates a RouteMatch struct.
func NewRouteMatch() *RouteMatch {
	return &RouteMatch{*NewParams()}
}

// Match returns whether or not the route matches the request.
func (r *Route) Match(method, path string) (RouteMatch, bool) {
	if r.method != method {
		return *NewRouteMatch(), false
	}

	if r.hasRouteParams() {
		if params, ok := r.params(path); ok {
			return RouteMatch{params}, true
		}
		return *NewRouteMatch(), false
	}

	if r.path == path {
		return *NewRouteMatch(), true
	}

	return *NewRouteMatch(), false
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
	if !hasValidCurlyBraces(r.path) {
		return fmt.Errorf("route path must have valid curly braces, got %v", r.path)
	}
	return nil
}

// hasValidCurlyBraces ensures that curly braces are used correctly in
// terms of path declaration.
func hasValidCurlyBraces(s string) bool {
	open := false
	for _, char := range s {
		if char == '{' {
			if open {
				return false
			} else {
				open = true
			}
		} else if char == '}' {
			if !open {
				return false
			} else {
				open = false
			}
		} else if char == '/' {
			if open {
				return false
			}
		}
	}
	return !open
}

// hasRouteParams returns whether or not the route has parameters.
func (r *Route) hasRouteParams() bool {
	for _, char := range r.path {
		if char == '{' {
			return true
		}
	}
	return false
}

func (r *Route) params(path string) (Params, bool) {
	src := strings.Split(r.path, "/")
	dst := strings.Split(path, "/")

	// ensure both routes have the same number of segments
	if len(src) != len(dst) {
		return Params{}, false
	}

	// extract the params
	p := NewParams()
	for i := 0; i < len(src); i++ {
		s := src[i]
		d := dst[i]
		if s == "" {
			continue
		} else if s[0] == '{' {
			key := s[1 : len(s)-1]
			val := d
			p.m[key] = val
		} else if s == d {
			continue
		} else {
			return Params{}, false
		}
	}

	return *p, true
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
