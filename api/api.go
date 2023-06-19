package api

import (
	"database/sql"
	"fmt"
	"net/http"

	"stringsync/api/handlers"
	"stringsync/api/middleware"
	"stringsync/api/router"
	"stringsync/database"
	"stringsync/services"
	"stringsync/util"
)

type Config struct {
	Port           int
	AllowedOrigins []string
	DbDriver       string
	DbHost         string
	DbPort         int
	DbName         string
	DbUser         string
	DbPassword     string
}

// Start configures and runs the API.
func Start(config Config) error {
	// Create logger.
	log := util.NewLogger(util.FormatterText)
	log.SetGlobalField("service", "api")

	// Establish database connection.
	if config.DbDriver != "postgres" {
		log.Fatalf("DbDriver not supported: %v", config.DbDriver)
	}
	dsn, err := database.GetPostgresDataSourceName(database.DsnParams{
		Host:     config.DbHost,
		Port:     config.DbPort,
		DbName:   config.DbName,
		User:     config.DbUser,
		Password: config.DbPassword,
	})
	if err != nil {
		log.Fatalf("could not calculate data source name: %v", err)
	}
	db, err := sql.Open(config.DbDriver, dsn)
	if err != nil {
		log.Fatalf("could not open database connection: %v", err)
	}
	defer db.Close()

	// Create services.
	healthService := services.NewHealthService(db)

	// Setup router middleware.
	handler := router.NewRouter()
	handler.Middleware(middleware.RequestID())
	handler.Middleware(
		middleware.Cors(config.AllowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	handler.Middleware(middleware.Logger(log))

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
