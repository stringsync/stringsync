package router

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

type testMiddleware struct {
	numCalls int
}

func (n *testMiddleware) Middleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		n.numCalls++
		h.ServeHTTP(w, r)
	})
}

func echoHandler(msg string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(msg))
	})
}

func TestRouter_Get_RespondsToGetRequests(t *testing.T) {
	router := NewRouter()
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	got := string(body)
	want := "ok"
	if got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestRouter_Get_IgnoresToNonGetRequests(t *testing.T) {
	router := NewRouter()
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/", nil)
	router.ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	got := string(body)
	want := "Not Found\n"
	if got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestRouter_Post_RespondsToPostRequests(t *testing.T) {
	router := NewRouter()
	router.Post("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/", nil)
	router.ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	got := string(body)
	want := "ok"
	if got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestRouter_Post_IgnoresNonPostRequests(t *testing.T) {
	router := NewRouter()
	router.Post("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	got := string(body)
	want := "Not Found\n"
	if got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestRouter_Middleware(t *testing.T) {
	middleware := &testMiddleware{}

	router := NewRouter()
	router.Middleware(middleware.Middleware)
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	if got, want := middleware.numCalls, 1; got != want {
		t.Errorf("middleware.numCalls = %d, want %d", got, want)
	}
}

func TestRouter_Middleware_CallsEachMiddleware(t *testing.T) {
	middleware1 := &testMiddleware{}
	middleware2 := &testMiddleware{}

	router := NewRouter()
	router.Middleware(middleware1.Middleware)
	router.Middleware(middleware2.Middleware)
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	if got, want := middleware1.numCalls, 1; got != want {
		t.Errorf("middleware1.numCalls = %d, want %d", got, want)
	}
	if got, want := middleware2.numCalls, 1; got != want {
		t.Errorf("middleware2.numCalls = %d, want %d", got, want)
	}
}

func TestRouter_RegistersDeepPaths(t *testing.T) {
	router := NewRouter()
	router.Get("/foo/bar", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/foo/bar", nil)
	router.ServeHTTP(w, r)

	body, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("could not read body, got %v", err.Error())
	}

	got := string(body)
	want := "ok"
	if got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}

func TestRouter_DisallowsInvalidRoutes(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Fatalf("Get(\"\", echoHandler(\"ok\")) should have panicked")
		}
	}()

	router := NewRouter()
	router.Get("", echoHandler("ok"))
}
