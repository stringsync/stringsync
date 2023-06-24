package handlers

import (
	"io"
	"net/http"
	"net/http/httptest"
	"stringsync/services"
	"testing"
)

func TestHealthHandler_Get(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)

	service := services.NewTestHealthService()
	service.SetCheckDBHealth(true)

	handler := NewHealthHandler(service)
	handler.Get().ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	if got, want := string(body), "ok"; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}
