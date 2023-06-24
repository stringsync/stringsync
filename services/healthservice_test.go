package services

import (
	"stringsync/database"
	"testing"
)

func TestNewHealthService(t *testing.T) {
	db, cleanup := database.CreateTestDBFromEnv()
	defer cleanup()

	defer func() {
		if gotPanic := recover(); gotPanic != nil {
			t.Errorf("got unexpected panic: %v", gotPanic)
		}
	}()

	NewHealthService(db)
}
