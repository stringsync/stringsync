package services

import (
	"context"
	"stringsync/database"
	"stringsync/util"
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

func TestHealthService_CheckDBHealth(t *testing.T) {
	t.Run("returns true when DB can be pinged", func(t *testing.T) {
		db, cleanup := database.CreateTestDBFromEnv()
		defer cleanup()

		logger := util.NewLogger(util.FormatterText)
		ctx := context.Background()
		ctx = util.LogCtxSlot.Put(ctx, logger)
		healthService := NewHealthService(db)

		if got, want := healthService.CheckDBHealth(ctx), true; got != want {
			t.Errorf("healthService.CheckDBHealth(%v) = %v, want %v", ctx, got, want)
		}
	})

	t.Run("returns false when DB cannot be pinged", func(t *testing.T) {
		db, cleanup := database.CreateTestDBFromEnv()
		defer cleanup()

		logger := util.NewLogger(util.FormatterText)
		ctx := context.Background()
		ctx = util.LogCtxSlot.Put(ctx, logger)
		healthService := NewHealthService(db)

		// Close the DB connection to make pings fail.
		db.Close()

		if got, want := healthService.CheckDBHealth(ctx), false; got != want {
			t.Errorf("healthService.CheckDBHealth(%v) = %v, want %v", ctx, got, want)
		}
	})
}
