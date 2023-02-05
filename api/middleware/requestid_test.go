package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequestId_IsUniqueEachCall(t *testing.T) {
	gotRequestIds := []string{}

	middleware := RequestId()
	handler := middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestId := GetRequestId(r.Context())
		gotRequestIds = append(gotRequestIds, requestId)
	}))

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "http://example.com", nil)

	handler.ServeHTTP(w, r)
	handler.ServeHTTP(w, r)

	wantLen := 2
	if gotLen := len(gotRequestIds); gotLen != wantLen {
		t.Errorf("len(requestIds) = %d, want %d", gotLen, wantLen)
	}

	if gotRequestIds[0] == gotRequestIds[1] {
		t.Errorf("gotRequestIds[0] and gotRequestIds[1] are equal, want unequal values")
	}
}
