package services

import (
	"stringsync/database"
	"stringsync/util"
	"testing"
)

func TestNewHealthService(t *testing.T) {
	db, cleanup := database.CreateTestDB(database.Config{
		Driver:   "postgres",
		Host:     util.MustGetEnvString("DB_HOST"),
		Port:     util.MustGetEnvInt("DB_PORT"),
		DBName:   util.MustGetEnvString("DB_NAME"),
		User:     util.MustGetEnvString("DB_USERNAME"),
		Password: util.MustGetEnvString("DB_PASSWORD"),
	})
	defer cleanup()

	db.Ping()
}
