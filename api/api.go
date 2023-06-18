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
	// setup logger
	logger := util.NewLogger(util.FormatterText)
	logger.SetGlobalField("service", "api")

	// create service
	service := service.New(service.Config{
		DbHost:     config.DbHost,
		DbPort:     config.DbPort,
		DbName:     config.DbName,
		DbUser:     config.DbUser,
		DbPassword: config.DbPassword,
	})
	defer service.Cleanup()

	// setup router
	router := router.NewRouter()

	router.Middleware(middleware.RequestId())

	router.Middleware(
		middleware.Cors(config.AllowedOrigins, []string{
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
	addr := fmt.Sprintf(":%d", config.Port)
	logger.Infof("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}
