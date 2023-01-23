package router

import (
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

type testMiddleware struct {
	effect func()
}

func (n *testMiddleware) Middleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if n.effect != nil {
			n.effect()
		}
		h.ServeHTTP(w, r)
	})
}

func echoHandler(msg string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(msg))
	})
}

func TestRouter_CanHandle(t *testing.T) {
	router := NewRouter()
	router.Get("/foo", echoHandler("ok"))

	for _, test := range []struct {
		name   string
		method string
		path   string
		want   bool
	}{
		{
			name:   "when the method and path match",
			method: http.MethodGet,
			path:   "/foo",
			want:   true,
		}, {
			name:   "when the method matches but path does not",
			method: http.MethodGet,
			path:   "/bar",
			want:   false,
		}, {
			name:   "when the path matches but the method does not",
			method: http.MethodPost,
			path:   "/foo",
			want:   false,
		}, {
			name:   "when neither path nor method matches",
			method: http.MethodPost,
			path:   "/bar",
			want:   false,
		},
	} {
		t.Run(t.Name(), func(t *testing.T) {
			if got := router.CanHandle(test.method, test.path); got != test.want {
				t.Errorf("CanHandle(%q, %q) = %v, want %v",
					test.method, test.path, got, test.want)
			}
		})
	}
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
	numCalls := 0
	middleware := &testMiddleware{func() { numCalls++ }}

	router := NewRouter()
	router.Middleware(middleware.Middleware)
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	if got, want := numCalls, 1; got != want {
		t.Errorf("numCalls = %d, want %d", got, want)
	}
}

func TestRouter_Middleware_CallsEachMiddleware(t *testing.T) {
	numCalls1 := 0
	numCalls2 := 0
	middleware1 := &testMiddleware{func() { numCalls1++ }}
	middleware2 := &testMiddleware{func() { numCalls2++ }}

	router := NewRouter()
	router.Middleware(middleware1.Middleware)
	router.Middleware(middleware2.Middleware)
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	if got, want := numCalls1, 1; got != want {
		t.Errorf("numCalls1 = %d, want %d", got, want)
	}
	if got, want := numCalls2, 1; got != want {
		t.Errorf("numCalls2 = %d, want %d", got, want)
	}
}

func TestRouter_Middleware_CallsInDeclarationOrder(t *testing.T) {
	got := []int{}
	middleware1 := &testMiddleware{func() { got = append(got, 1) }}
	middleware2 := &testMiddleware{func() { got = append(got, 2) }}

	router := NewRouter()
	router.Middleware(middleware1.Middleware)
	router.Middleware(middleware2.Middleware)
	router.Get("/", echoHandler("ok"))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	router.ServeHTTP(w, r)

	want := []int{1, 2}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("got = %v, want %v", got, want)
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
