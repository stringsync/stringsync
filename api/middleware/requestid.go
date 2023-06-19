package middleware

import (
	"net/http"
	"stringsync/util"

	"github.com/google/uuid"
)

const RequestIDHeader = "X-Request-ID"

// RequestID creates a request ID, and adds it to a X-Request-ID header.
func RequestID() func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create a new request ID.
			requestID := uuid.NewString()

			// Add request ID to the context.
			ctx := util.RequestIDCtxSlot.Put(r.Context(), requestID)
			r = r.WithContext(ctx)

			// Add request ID to header.
			w.Header().Add(RequestIDHeader, requestID)

			// Propagate request.
			handler.ServeHTTP(w, r)
		})
	}
}
