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
	route, err := router.match(r.Method, r.URL.Path)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	// Call the middlewares in the same order that they were installed.
	h := route.handler
	for i := len(router.middlewares) - 1; i >= 0; i-- {
		h = router.middlewares[i](h)
	}

	h.ServeHTTP(w, r)
}

// NewRouter returns a Router that can be used as an http handler.
func NewRouter() *Router {
	return &Router{}
}

// CanHandle determines if a method and path can be handled by the router.
func (router *Router) CanHandle(method, path string) bool {
	_, err := router.match(method, path)
	return err == nil
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
	if err := route.Validate(); err != nil {
		panic(err)
	}
	router.routes = append(router.routes, route)
}

// match finds a route that matches the method and path.
func (router *Router) match(method, path string) (*Route, error) {
	for _, route := range router.routes {
		if route.Matches(method, path) {
			return &route, nil
		}
	}
	return nil, fmt.Errorf("%v %v not found", method, path)
}
