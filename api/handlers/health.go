package handlers

import (
	"fmt"
	"net/http"
	"stringsync/service"
)

type Health struct {
	service *service.Service
}

func NewHealth(s *service.Service) *Health {
	return &Health{service: s}
}

func (h *Health) Get(w http.ResponseWriter, r *http.Request) {
	_, err := h.service.Db.ExecContext(r.Context(), "SELECT NOW();")
	if err != nil {
		fmt.Printf("db is not healthy: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write([]byte("ok"))
}
