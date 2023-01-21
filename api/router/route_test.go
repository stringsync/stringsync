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
