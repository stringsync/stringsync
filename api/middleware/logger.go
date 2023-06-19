package middleware

import (
	"net/http"
	"stringsync/util"
	"time"
)

// statusWriter tracks the statusCode when writing to it.
type statusWriter struct {
	http.ResponseWriter
	statusCode int
}

// Logger is a middleware that logs basic information about the request.
func Logger(log *util.Logger) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create a new logger.
			log = log.NewChild()
			requestID := util.RequestIDCtxSlot.Get(r.Context())
			log.SetLocalField("requestID", requestID)

			// Track the start time.
			start := time.Now()

			// Update the context with a logger and create a status writer.
			ctx := util.LogCtxSlot.Put(r.Context(), log)
			r = r.WithContext(ctx)
			sw := newStatusWriter(w)

			// Propagate the request and wrap the start and end with logs.
			log.Infof("Started %s %s", r.Method, r.URL.Path)
			handler.ServeHTTP(sw, r)
			log.Infof("Completed %d %s in %v",
				sw.statusCode, http.StatusText(sw.statusCode), time.Since(start))
		})
	}
}

// newStatusWriter wraps http's ResponseWriter to track HTTP status.
func newStatusWriter(w http.ResponseWriter) *statusWriter {
	return &statusWriter{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
	}
}

// WriteHeader saves the status method
func (w *statusWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode
	w.ResponseWriter.WriteHeader(statusCode)
}
