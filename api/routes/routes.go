package routes

import (
	"encoding/json"
	"net/http"
	"stringsync/api/middleware"
	"stringsync/api/service"
)

type router struct {
	c RoutesConfig
}

type RoutesConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
}

func Install(mux *http.ServeMux, c RoutesConfig) {
	r := &router{c}

	mux.Handle("/ping", r.handle(ping))
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

func ping(w http.ResponseWriter, r *http.Request) {
	req := service.PingRequest{}
	res := service.Ping(r.Context(), req)
	json, _ := json.Marshal(res)
	w.Write(json)
}

func health(w http.ResponseWriter, r *http.Request) {
	res, err := service.Health(r.Context())
	if err != nil {
		return
	}
	w.Write([]byte(res))
}

func root(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello world"))
}
