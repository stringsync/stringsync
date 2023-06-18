package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"stringsync/util"
	"testing"
)

func TestLogger(t *testing.T) {
	var b strings.Builder
	logger := util.NewLogger(util.FormatterJson)
	logger.SetOutput(&b)

	middleware := Logger(logger)
	handler := middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)

	handler.ServeHTTP(w, r)

	logs := strings.Split(b.String(), "\n")
	logs = logs[:2]

	var log1 map[string]any
	var log2 map[string]any

	json.Unmarshal([]byte(logs[0]), &log1)
	json.Unmarshal([]byte(logs[1]), &log2)

	var msg1 string
	var msg2 string
	var ok bool

	if msg1, ok = log1["msg"].(string); !ok {
		t.Errorf(`log1["msg"] is not a string, want string`)
	}
	if msg2, ok = log2["msg"].(string); !ok {
		t.Errorf(`log2["msg"] is not a string, want string`)
	}
	if !strings.Contains(msg1, "Started GET /") {
		t.Errorf(`strings.Contains(%q, "Started GET /") = false, want true`, msg1)
	}
	if !strings.Contains(msg2, "Completed 200 OK") {
		t.Errorf(`strings.Contains(%q, "Completed 200 OK") = false, want true`, msg2)
	}
}
