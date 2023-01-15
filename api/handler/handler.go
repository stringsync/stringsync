package handler

import (
	"encoding/json"
	"net/http"

	"github.com/stringsync/api/service"
)

type Handler func(w http.ResponseWriter, r *http.Request) error
type HandlerFunc func(w http.ResponseWriter, r *http.Request)

func Setup() {
	http.HandleFunc("/ping", handler(ping))
	http.HandleFunc("/health", handler(health))
	http.HandleFunc("/", handler(root))
}

func handler(h Handler) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
	}
}

func ping(w http.ResponseWriter, r *http.Request) error {
	req := service.PingRequest{}
	res := service.Ping(r.Context(), req)
	json, _ := json.Marshal(res)
	w.Write(json)
	return nil
}

func health(w http.ResponseWriter, r *http.Request) error {
	res, err := service.Health(r.Context())
	if err != nil {
		return err
	}
	w.Write([]byte(res))
	return nil
}

func root(w http.ResponseWriter, r *http.Request) error {
	return nil
}
