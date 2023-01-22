package router

import (
	"net/http"
	"testing"
)

func TestRoute_Matches(t *testing.T) {
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
		}, {
			name:   "returns true when matching deep paths",
			route:  Route{http.MethodGet, "/foo/bar", noop},
			method: http.MethodGet,
			path:   "/foo/bar",
			want:   true,
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			if got := test.route.Matches(test.method, test.path); got != test.want {
				t.Errorf("Matches(%q, %q) = %t, want %t",
					test.method, test.path, got, test.want)
			}
		})
	}
}

func TestRoute_Validate(t *testing.T) {
	noop := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})

	for _, test := range []struct {
		name    string
		route   Route
		wantErr bool
	}{
		{
			name:    "allows valid method and path",
			route:   Route{http.MethodGet, "/", noop},
			wantErr: false,
		}, {
			name:    "disallows invalid method",
			route:   Route{"FOO", "/", noop},
			wantErr: true,
		}, {
			name:    "disallows empty path",
			route:   Route{http.MethodGet, "", noop},
			wantErr: true,
		}, {
			name:    "disallows path not beginning in slash",
			route:   Route{http.MethodGet, "foo", noop},
			wantErr: true,
		}, {
			name:    "disallows path ending in slash",
			route:   Route{http.MethodGet, "/foo/", noop},
			wantErr: true,
		}, {
			name:    "allows deep paths",
			route:   Route{http.MethodGet, "/foo/bar", noop},
			wantErr: false,
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			gotErr := test.route.Validate()
			if test.wantErr && gotErr == nil {
				t.Errorf("Validate() = %v, but wanted error", gotErr)
			}
			if !test.wantErr && gotErr != nil {
				t.Errorf("Validate() = %v, but did not want error", gotErr)
			}
		})
	}
}
