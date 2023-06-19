package middlewares

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

const (
	originHeader       = "Origin"
	methodHeader       = "Access-Control-Request-Method"
	allowOriginHeader  = "Access-Control-Allow-Origin"
	allowMethodsHeader = "Access-Control-Allow-Methods"
)

func TestCors(t *testing.T) {
	for _, test := range []struct {
		name           string
		allowedOrigins []string
		allowedMethods []string
		headers        map[string]string
		wantHeaders    map[string]string
	}{
		{
			name:           "origin and method allowed",
			allowedOrigins: []string{"http://example.com"},
			allowedMethods: []string{http.MethodGet},
			headers: map[string]string{
				originHeader: "http://example.com",
				methodHeader: http.MethodGet,
			},
			wantHeaders: map[string]string{
				allowOriginHeader:  "http://example.com",
				allowMethodsHeader: http.MethodGet,
			},
		}, {
			name:           "origin allowed and method disallowed",
			allowedOrigins: []string{"http://example.com"},
			allowedMethods: []string{},
			headers: map[string]string{
				originHeader: "http://example.com",
				methodHeader: http.MethodGet,
			},
			wantHeaders: map[string]string{
				allowOriginHeader:  "http://example.com",
				allowMethodsHeader: "",
			},
		}, {
			name:           "origin disallowed and method allowed",
			allowedOrigins: []string{},
			allowedMethods: []string{http.MethodGet},
			headers: map[string]string{
				originHeader: "http://example.com",
				methodHeader: http.MethodGet,
			},
			wantHeaders: map[string]string{
				allowOriginHeader:  "",
				allowMethodsHeader: http.MethodGet,
			},
		}, {
			name:           "origin disallowed and method disallowed",
			allowedOrigins: []string{},
			allowedMethods: []string{},
			headers: map[string]string{
				originHeader: "http://example.com",
				methodHeader: http.MethodGet,
			},
			wantHeaders: map[string]string{
				allowOriginHeader:  "",
				allowMethodsHeader: "",
			},
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			middleware := Cors(test.allowedOrigins, test.allowedMethods)
			handler := middleware(http.HandlerFunc(func(http.ResponseWriter, *http.Request) {}))

			w := httptest.NewRecorder()
			r := httptest.NewRequest(http.MethodGet, "http://example.com", nil)
			for key, value := range test.headers {
				r.Header.Add(key, value)
			}

			handler.ServeHTTP(w, r)

			for key, wantHeader := range test.wantHeaders {
				gotHeader := w.Header().Get(key)
				if wantHeader != gotHeader {
					t.Errorf("%q = %q, want %q", key, gotHeader, wantHeader)
				}
			}
		})
	}
}
