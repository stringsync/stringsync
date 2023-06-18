package middleware

import (
	"context"
	"log"
	"net/http"
	"stringsync/api/internal/ctx"
	"stringsync/api/util"
	"time"
)

const loggerKey = ctx.CtxKey("stringsync.api.middleware.logger")

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
			ctx := context.WithValue(r.Context(), loggerKey, logger)
			r = r.WithContext(ctx)
			sw := newStatusWriter(w)

			// Create a new logger.
			logger = logger.NewChild()
			requestId := GetRequestId(r.Context())
			logger.SetLocalField("requestId", requestId)

			// Propagate the request and wrap the start and end with logs.
			logger.Infof("Started %s %s", r.Method, r.URL.Path)
			handler.ServeHTTP(sw, r)
			logger.Infof("Completed %d %s in %v",
				sw.statusCode, http.StatusText(sw.statusCode), time.Since(start))
		})
	}
}

// GetLogger returns the logger associated with a request.
func GetLogger(ctx context.Context) *log.Logger {
	logger, _ := ctx.Value(loggerKey).(*log.Logger)
	return logger
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
