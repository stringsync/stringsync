package router

import (
	"net/http"
	"testing"
)

func TestRouteMatches(t *testing.T) {
	noop := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})

	for _, test := range []struct {
		name   string
		route  Route
		method string
		path   string
		want   bool
	}{
		{
			name:   "returns true when the method and path match",
			route:  Route{http.MethodGet, "/foo", noop},
			method: http.MethodGet,
			path:   "/foo",
			want:   true,
		}, {
			name:   "returns false when the method does not match",
			route:  Route{http.MethodGet, "/foo", noop},
			method: http.MethodPost,
			path:   "/foo",
			want:   false,
		}, {
			name:   "returns false when the path does not match",
			route:  Route{http.MethodGet, "/foo", noop},
			method: http.MethodGet,
			path:   "/bar",
			want:   false,
		}, {
			name:   "returns false when the method and path do not match",
			route:  Route{http.MethodGet, "/foo", noop},
			method: http.MethodPost,
			path:   "/bar",
			want:   false,
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			if got := test.route.Matches(test.method, test.path); got != test.want {
				t.Errorf("route.Matches(%q, %q) = %t, want %t",
					test.method, test.path, got, test.want)
			}
		})
	}
}
