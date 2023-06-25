package database

import "testing"

func TestCreateTestDB(t *testing.T) {
	config := ConfigFromEnv()
	db, cleanup := CreateTestDB(config)
	defer cleanup()

	db.Ping()
}

func TestCreateTestDBFromEnv(t *testing.T) {
	db, cleanup := CreateTestDBFromEnv()
	defer cleanup()

	db.Ping()
}
