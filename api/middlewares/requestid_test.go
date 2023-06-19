package middlewares

import (
	"net/http"
	"net/http/httptest"
	"stringsync/util"
	"testing"
)

func TestRequestId_IsUniqueEachCall(t *testing.T) {
	gotRequestIDs := []string{}

	middleware := RequestID()
	handler := middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := util.RequestIDCtxSlot.Get(r.Context())
		gotRequestIDs = append(gotRequestIDs, requestID)
	}))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "http://example.com", nil)

	handler.ServeHTTP(w, r)
	handler.ServeHTTP(w, r)

	wantLen := 2
	if gotLen := len(gotRequestIDs); gotLen != wantLen {
		t.Errorf("len(gotRequestIDs) = %d, want %d", gotLen, wantLen)
	}

	if gotRequestIDs[0] == gotRequestIDs[1] {
		t.Errorf("gotRequestIDs[0] and gotRequestIDs[1] are equal, want unequal values")
	}
}
