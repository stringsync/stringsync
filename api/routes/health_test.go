package routes

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetHealth(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)

	GetHealth().ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	if got, want := string(body), "ok"; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}
