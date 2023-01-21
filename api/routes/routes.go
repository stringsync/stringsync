package routes

import (
	"net/http"
	"stringsync/api/middleware"
	"stringsync/api/service"
)

// router contains fields common to routes.
type router struct {
	c RouterConfig
}

// RouterConfig contains fields to configure the router.
type RouterConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
}

// Install adds handlers to mux.
func Install(mux *http.ServeMux, c RouterConfig) {
	r := &router{c}

	mux.Handle("/health", r.handle(health))
	mux.Handle("/", r.handle(root))
}

func (r *router) handle(f func(http.ResponseWriter, *http.Request)) http.Handler {
	var h http.Handler
	h = http.HandlerFunc(f)
	h = middleware.WithLogger(h)
	h = middleware.WithCors(h, r.c.AllowedOrigins, r.c.AllowedMethods)
	return h
}

func root(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello world"))
}

func health(w http.ResponseWriter, r *http.Request) {
	res, err := service.Health(r.Context())
	if err != nil {
		return
	}
	w.Write([]byte(res))
}
