package handlers

import (
	"io"
	"net/http"
	"net/http/httptest"
	"stringsync/service"
	"testing"
)

func TestGet(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)

	NewHealth(service.New(service.Config{})).Get(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	if got, want := string(body), "ok"; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}
