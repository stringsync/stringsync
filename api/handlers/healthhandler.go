package handlers

import (
	"net/http"
	"stringsync/services"
)

type HealthHandler struct {
	service services.HealthService
}

func NewHealthHandler(service services.HealthService) *HealthHandler {
	return &HealthHandler{service: service}
}

func (h *HealthHandler) Get() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if h.service.CheckDBHealth(r.Context()) {
			respondOK(w)
		} else {
			respondInternalError(w)
		}
	})
}

func respondOK(w http.ResponseWriter) {
	w.Write([]byte("ok"))
}

func respondInternalError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
}
