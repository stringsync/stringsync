package api

import (
	"fmt"
	"net/http"

	"stringsync/api/handlers"
	"stringsync/api/middleware"
	"stringsync/api/router"
	"stringsync/api/util"
	"stringsync/service"
)

// Start runs the API.
func Start(port int, allowedOrigins []string) error {
	// setup logger
	logger := util.NewLogger(util.FormatterText)
	logger.SetGlobalField("service", "api")

	// validate port
	if port <= 0 {
		return fmt.Errorf("port must be valid, got: %d", port)
	}

	// create service
	service := service.New(service.Config{
		DbHost:     util.MustGetEnvString("DB_HOST"),
		DbPort:     int(util.MustGetEnvInt("DB_PORT")),
		DbName:     util.MustGetEnvString("DB_NAME"),
		DbUser:     util.MustGetEnvString("DB_USERNAME"),
		DbPassword: util.MustGetEnvString("DB_PASSWORD"),
	})
	defer service.Cleanup()

	// setup router
	router := router.NewRouter()

	router.Middleware(middleware.RequestId())

	router.Middleware(
		middleware.Cors(allowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))

	router.Middleware(middleware.Logger(logger))

	health := handlers.NewHealth(service)
	router.Get("/health", health.Get)

	// run server
	mux := http.NewServeMux()
	mux.Handle("/", router)
	addr := fmt.Sprintf(":%d", port)
	fmt.Printf("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}
