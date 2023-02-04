package api

import (
	"fmt"
	"net/http"

	"stringsync/api/handlers"
	"stringsync/api/middleware"
	"stringsync/api/router"
)

func Start(port int, allowedOrigins []string) error {
	// validate port
	if port <= 0 {
		return fmt.Errorf("port must be valid, got: %d", port)
	}

	// setup router
	router := router.NewRouter()
	router.Middleware(
		middleware.Cors(allowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	router.Middleware(middleware.Logger)
	router.Get("/health", handlers.GetHealth)

	// run server
	mux := http.NewServeMux()
	mux.Handle("/", router)
	addr := fmt.Sprintf(":%d", port)
	fmt.Printf("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}
