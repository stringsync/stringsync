package middleware

import (
	"net/http"
	"strings"
)

type cors struct {
	handler        http.Handler
	allowedOrigins []string
	allowedMethods []string
}

func WithCors(handler http.Handler, allowedOrigins []string, allowedMethods []string) *cors {
	return &cors{handler, allowedOrigins, allowedMethods}
}

func (c *cors) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	headers := w.Header()

	origin := r.Header.Get("Origin")
	if c.isOriginAllowed(origin) {
		headers.Add("Access-Control-Allow-Origin", strings.ToLower(origin))
	}

	method := r.Header.Get("Access-Control-Request-Method")
	if c.isMethodAllowed(method) {
		headers.Add("Access-Control-Allow-Methods", strings.ToUpper(method))
	}

	c.handler.ServeHTTP(w, r)
}

func (c *cors) isOriginAllowed(origin string) bool {
	for _, allowedOrigin := range c.allowedOrigins {
		if strings.EqualFold(allowedOrigin, origin) {
			return true
		}
	}
	return false
}

func (c *cors) isMethodAllowed(method string) bool {
	for _, allowedMethod := range c.allowedMethods {
		if strings.EqualFold(allowedMethod, method) {
			return true
		}
	}
	return false
}
