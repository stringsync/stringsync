package services

import (
	"stringsync/database"
	"testing"
)

func TestNewHealthService(t *testing.T) {
	db, cleanup := database.CreateTestDB(database.Config{
		Driver:   "postgres",
		Host:     "localhost",
		Port:     5432,
		DBName:   "stringsync",
		User:     "stringsync",
		Password: "stringsync",
	})
	defer cleanup()

	db.Ping()
}
