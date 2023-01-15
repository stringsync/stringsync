package middleware

import (
	"log"
	"net/http"
	"time"
)

type logger struct {
	handler http.Handler
}

func WithLogger(handler http.Handler) *logger {
	return &logger{handler}
}

func (l *logger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	l.handler.ServeHTTP(w, r)
	log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
}
