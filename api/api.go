package api

import (
	"fmt"
	"net/http"

	"stringsync/api/handlers"
	"stringsync/api/middlewares"
	"stringsync/api/router"
	"stringsync/database"
	"stringsync/services"
	"stringsync/util"
)

type Config struct {
	Port           int
	AllowedOrigins []string
	DBDriver       string
	DBHost         string
	DBPort         int
	DBName         string
	DBUser         string
	DBPassword     string
}

// Start configures and runs the API.
func Start(config Config) error {
	// Create logger.
	log := util.NewLogger(util.FormatterText)
	log.SetGlobalField("service", "api")

	db, err := database.Connect(toDatabaseConfig(config))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create services.
	healthService := services.NewHealthService(db)

	// Setup router middleware.
	handler := router.NewRouter()
	handler.Middleware(middlewares.RequestID())
	handler.Middleware(
		middlewares.Cors(config.AllowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	handler.Middleware(middlewares.Logger(log))

	// Define routes.
	health := handlers.NewHealthHandler(healthService)
	handler.Get("/health", health.Get())

	// Run server.
	mux := http.NewServeMux()
	mux.Handle("/", handler)
	addr := fmt.Sprintf(":%d", config.Port)
	log.Infof("Server running at: http://localhost%v\n", addr)
	return http.ListenAndServe(addr, mux)
}

func toDatabaseConfig(config Config) database.Config {
	return database.Config{
		Driver:   config.DBDriver,
		Host:     config.DBHost,
		Port:     config.DBPort,
		DBName:   config.DBName,
		User:     config.DBUser,
		Password: config.DBPassword,
	}
}
