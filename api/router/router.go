package router

import (
	"fmt"
	"net/http"
)

// Router contains fields common to routes.
type Router struct {
	routes      map[string][]route
	middlewares []Middleware
}

// route encapsulates the information to match and handle a route.
type route struct {
	path    string
	method  string
	handler http.Handler
}

type Middleware func(http.Handler) http.Handler

// ServeHTTP runs all the middleware and tries to handle the requested route.
func (router *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	route, err := router.match(r)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	h := route.handler
	for _, middleware := range router.middlewares {
		h = middleware(h)
	}

	h.ServeHTTP(w, r)
}

// New returns a Router that can be used as an http handler.
func New() *Router {
	return &Router{
		routes:      map[string][]route{},
		middlewares: []Middleware{},
	}
}

// Middleware adds a middleware to the router. Middlewares get called in the
// order that they were added.
func (router *Router) Middleware(m Middleware) {
	router.middlewares = append(router.middlewares, m)
}

// Get registers a GET handler.
func (router *Router) Get(path string, h http.Handler) {
	router.register(route{path, http.MethodGet, h})
}

// Post registers a POST handler.
func (router *Router) Post(path string, h http.Handler) {
	router.register(route{path, http.MethodPost, h})
}

// register adds the route to the router.
func (router *Router) register(route route) {
	if route.path == "" {
		panic(fmt.Errorf("route path cannot be empty"))
	}

	if string(route.path[0]) != "/" {
		panic(fmt.Errorf("route path must begin with '/', got %v", route.path))
	}

	if string(route.path[len(route.path)-1]) == "/" {
		panic(fmt.Errorf("route path cannot end in '/', got %v", route.path))
	}

	if !isValidMethod(route.method) {
		panic(fmt.Errorf("route method must be an http verb, got %v", route.method))
	}

	if router.isRegistered(route.path, route.method) {
		panic(fmt.Errorf("path %v already has %v registered, but it can only "+
			"be registered once", route.path, route.method))
	}

	router.routes[route.path] = append(router.routes[route.path], route)
}

// isRegistered checks if the path and method combination already exists.
func (router *Router) isRegistered(path, method string) bool {
	for _, route := range router.routes[path] {
		if route.method == method {
			return true
		}
	}
	return false
}

// isValidMethod validates that the method is a support HTTP verb.
func isValidMethod(method string) bool {
	switch method {
	case http.MethodHead:
		fallthrough
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

// match finds a route that matches the HTTP request.
func (router *Router) match(r *http.Request) (route, error) {
	path := r.URL.Path
	if _, ok := router.routes[path]; !ok {
		return route{}, fmt.Errorf("%v not found", path)
	}

	method := r.Method
	for _, route := range router.routes[path] {
		if route.method == method {
			return route, nil
		}
	}

	return route{}, fmt.Errorf("%v %v not found", method, path)
}
