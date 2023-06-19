package services

import (
	"context"
	"database/sql"
)

type healthService struct {
	// TODO(jared) Add logger.
	db *sql.DB
}

// NewHealthService creates a new health service.
func NewHealthService(db *sql.DB) HealthService {
	return &healthService{db}
}

// CheckDBHealth returns whether the DB can be pinged.
func (h *healthService) CheckDBHealth(ctx context.Context) bool {
	err := h.db.PingContext(ctx)
	return err == nil
}
