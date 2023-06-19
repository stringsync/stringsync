package services

import (
	"context"
	"database/sql"
)

type healthService struct {
	// TODO(jared) Add logger.
	db *sql.DB
}

func NewHealthService(db *sql.DB) *healthService {
	return &healthService{db}
}

func (h *healthService) IsDbHealthy(ctx context.Context) bool {
	err := h.db.PingContext(ctx)
	return err == nil
}
