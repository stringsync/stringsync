package api

import (
	"fmt"
	"net/http"

	"stringsync/api/handlers"
	"stringsync/api/middleware"
	"stringsync/api/router"
	"stringsync/services"
	"stringsync/util"
)

type Config struct {
	Port           int
	AllowedOrigins []string
	DbHost         string
	DbPort         int
	DbName         string
	DbUser         string
	DbPassword     string
}

// Start runs the API.
func Start(config Config) error {
	log := util.NewLogger(util.FormatterText)
	log.SetGlobalField("service", "api")

	healthService := services.NewTestHealthService()

	handler := router.NewRouter()
	handler.Middleware(middleware.RequestID())
	handler.Middleware(
		middleware.Cors(config.AllowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	handler.Middleware(middleware.Logger(log))

	health := handlers.NewHealthHandler(healthService)
	handler.Get("/health", health.Get())

	mux := http.NewServeMux()
	mux.Handle("/", handler)
	addr := fmt.Sprintf(":%d", config.Port)
	log.Infof("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}
