package router

import (
	"net/http"
	"reflect"
	"testing"
)

func TestRoute_Match(t *testing.T) {
	noop := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})

	for _, test := range []struct {
		name      string
		route     Route
		method    string
		path      string
		wantOk    bool
		wantMatch RouteMatch
	}{
		{
			name:      "method and path match",
			route:     Route{http.MethodGet, "/foo", noop},
			method:    http.MethodGet,
			path:      "/foo",
			wantOk:    true,
			wantMatch: RouteMatch{},
		}, {
			name:      "method does not match",
			route:     Route{http.MethodGet, "/foo", noop},
			method:    http.MethodPost,
			path:      "/foo",
			wantOk:    false,
			wantMatch: RouteMatch{},
		}, {
			name:      "path does not match",
			route:     Route{http.MethodGet, "/foo", noop},
			method:    http.MethodGet,
			path:      "/bar",
			wantOk:    false,
			wantMatch: RouteMatch{},
		}, {
			name:      "method and path do not match",
			route:     Route{http.MethodGet, "/foo", noop},
			method:    http.MethodPost,
			path:      "/bar",
			wantOk:    false,
			wantMatch: RouteMatch{},
		}, {
			name:      "deep paths",
			route:     Route{http.MethodGet, "/foo/bar", noop},
			method:    http.MethodGet,
			path:      "/foo/bar",
			wantOk:    true,
			wantMatch: RouteMatch{},
		}, {
			name:      "simple paths with route params",
			route:     Route{http.MethodGet, "/{foo}", noop},
			method:    http.MethodGet,
			path:      "/bar",
			wantOk:    true,
			wantMatch: RouteMatch{map[string]string{"foo": "bar"}},
		}, {
			name:      "deep paths with route params",
			route:     Route{http.MethodGet, "/foo/bar/{id}", noop},
			method:    http.MethodGet,
			path:      "/foo/bar/1",
			wantOk:    true,
			wantMatch: RouteMatch{map[string]string{"id": "1"}},
		}, {
			name:      "complex paths with multiple route params",
			route:     Route{http.MethodGet, "/foo/{fooId}/bar/{barId}", noop},
			method:    http.MethodGet,
			path:      "/foo/abc/bar/1",
			wantOk:    true,
			wantMatch: RouteMatch{map[string]string{"fooId": "abc", "barId": "1"}},
		}, {
			name:      "paths with route params ending in non route param",
			route:     Route{http.MethodGet, "/foo/{id}/bar", noop},
			method:    http.MethodGet,
			path:      "/foo/1/bar",
			wantOk:    true,
			wantMatch: RouteMatch{map[string]string{"id": "1"}},
		}, {
			name:      "non-match paths with route params",
			route:     Route{http.MethodGet, "/foo/{id}", noop},
			method:    http.MethodGet,
			path:      "/foo/1/bar",
			wantOk:    false,
			wantMatch: RouteMatch{},
		}, {
			name:      "non-match paths with route params",
			route:     Route{http.MethodGet, "/bar/{id}", noop},
			method:    http.MethodGet,
			path:      "/foo/1",
			wantOk:    false,
			wantMatch: RouteMatch{},
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			gotMatch, gotOk := test.route.Match(test.method, test.path)
			if !reflect.DeepEqual(gotMatch, test.wantMatch) || gotOk != test.wantOk {
				t.Errorf("Match(%q, %q) = %v, %v, want %v",
					test.method, test.path, gotMatch, gotOk, test.wantOk)
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
		}, {
			name:    "allows route params",
			route:   Route{http.MethodGet, "/foo/{id}", noop},
			wantErr: false,
		}, {
			name:    "allows pure route params",
			route:   Route{http.MethodGet, "/{method}/{id}", noop},
			wantErr: false,
		}, {
			name:    "disallows { characters without complement",
			route:   Route{http.MethodGet, "/foo/{id", noop},
			wantErr: true,
		}, {
			name:    "disallows } characters without complement",
			route:   Route{http.MethodGet, "/foo/id}", noop},
			wantErr: true,
		}, {
			name:    "disallows / characters inside curly braces",
			route:   Route{http.MethodGet, "/foo/{/id}", noop},
			wantErr: true,
		}, {
			name:    "disallows multiple { characters in a row",
			route:   Route{http.MethodGet, "/foo/{{id}", noop},
			wantErr: true,
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
