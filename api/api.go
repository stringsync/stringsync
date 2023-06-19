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
	log := setupLogger()

	r := setupRouter(config, log)

	return run(config, log, r)
}

func setupLogger() *util.Logger {
	logger := util.NewLogger(util.FormatterText)
	logger.SetGlobalField("service", "api")
	return logger
}

func setupRouter(config Config, logger *util.Logger) *router.Router {
	r := router.NewRouter()

	r.Middleware(middleware.RequestID())
	r.Middleware(
		middleware.Cors(config.AllowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	r.Middleware(middleware.Logger(logger))

	healthService := services.NewTestHealthService()
	health := handlers.NewHealthHandler(healthService)
	r.Get("/health", health.Get())

	return r
}

func run(config Config, log *util.Logger, r *router.Router) error {
	mux := http.NewServeMux()
	mux.Handle("/", r)
	addr := fmt.Sprintf(":%d", config.Port)
	log.Infof("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}
