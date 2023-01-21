package router

import (
	"fmt"
	"net/http"
)

// Router contains fields common to routes.
type Router struct {
	routes      []Route
	middlewares []Middleware
}

// Middleware is a handler that adds functionality to another handler.
type Middleware func(http.Handler) http.Handler

// ServeHTTP runs all the middleware and tries to handle the requested route.
func (router *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	route, err := router.match(r)
	if err != nil {
		fmt.Println(err.Error())
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
		routes:      []Route{},
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
	router.register(Route{http.MethodGet, path, h})
}

// Post registers a POST handler.
func (router *Router) Post(path string, h http.Handler) {
	router.register(Route{http.MethodPost, path, h})
}

// register adds the route to the router.
func (router *Router) register(route Route) {
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
	router.routes = append(router.routes, route)
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
func (router *Router) match(r *http.Request) (*Route, error) {
	method := r.Method
	path := r.URL.Path
	for _, route := range router.routes {
		if route.Matches(method, path) {
			return &route, nil
		}
	}
	return nil, fmt.Errorf("%v %v not found", method, path)
}
