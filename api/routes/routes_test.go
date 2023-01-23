package routes

import (
	"fmt"
	"net/http"
	"stringsync/api/router"
	"testing"
)

func TestApply(t *testing.T) {
	for _, test := range []struct {
		method string
		path   string
	}{
		{method: http.MethodGet, path: "/health"},
	} {
		t.Run(fmt.Sprintf("%v %v", test.method, test.path), func(t *testing.T) {
			router := router.NewRouter()
			Apply(router)

			if got, want := router.CanHandle(test.method, test.path), true; got != want {
				t.Errorf("CanHandle(%q, %q) = %v, want %v",
					test.method, test.path, got, want)
			}
		})
	}
}
