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
func Logger(logger *util.Logger) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Track the start time.
			start := time.Now()

			// Update the context with a logger and create a status writer.
			ctx := util.LogCtxSlot.Put(r.Context(), logger)
			r = r.WithContext(ctx)
			sw := newStatusWriter(w)

			// Create a new logger.
			logger = logger.NewChild()
			requestID := util.RequestIDCtxSlot.Get(ctx)
			logger.SetLocalField("requestID", requestID)

			// Propagate the request and wrap the start and end with logs.
			logger.Infof("Started %s %s", r.Method, r.URL.Path)
			handler.ServeHTTP(sw, r)
			logger.Infof("Completed %d %s in %v",
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
