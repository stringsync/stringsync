package service

import (
	"database/sql"
	"fmt"
	"log"
	"stringsync/database"
)

type Service struct {
	// TODO(jared) Add logger.
	Db *sql.DB
}

type Config struct {
	DbHost     string
	DbPort     int
	DbName     string
	DbUser     string
	DbPassword string
}

// New initializes a Service instance for the given config.
func New(config Config) *Service {
	dsn, err := database.GetPostgresDsn(database.DsnParams{
		Host:     config.DbHost,
		Port:     config.DbPort,
		DbName:   config.DbName,
		User:     config.DbUser,
		Password: config.DbPassword,
	})
	if err != nil {
		log.Fatal(err)
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}

	return &Service{Db: db}
}

func (s *Service) Cleanup() {
	fmt.Println("Shutting down gracefully")

	s.Db.Close()

	fmt.Println("Graceful shutdown successful")
}
