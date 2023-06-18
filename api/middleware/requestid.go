package middleware

import (
	"context"
	"net/http"
	ctxkey "stringsync/api/internal/ctxkey"

	"github.com/google/uuid"
)

const (
	RequestIdHeader = "X-Request-ID"
	requestIdKey    = ctxkey.CtxKey("stringsync.api.middleware.requestId")
)

// RequestId creates a request ID, and adds it to a X-Request-ID header.
func RequestId() func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create a new request ID.
			requestId := uuid.NewString()

			// Add request ID to the context.
			ctx := context.WithValue(r.Context(), requestIdKey, requestId)
			r = r.WithContext(ctx)

			// Add request ID to header.
			w.Header().Add(RequestIdHeader, requestId)

			// Propagate request.
			handler.ServeHTTP(w, r)
		})
	}
}

// GetRequestId gets the request ID from the context.
func GetRequestId(ctx context.Context) string {
	requestId, _ := ctx.Value(requestIdKey).(string)
	return requestId
}
