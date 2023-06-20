package services

import (
	"context"
	"database/sql"
	"stringsync/util"
)

type healthService struct {
	db *sql.DB
}

// NewHealthService creates a new health service.
func NewHealthService(db *sql.DB) HealthService {
	return &healthService{db}
}

// CheckDBHealth returns whether the DB can be pinged.
func (h *healthService) CheckDBHealth(ctx context.Context) bool {
	log, _ := util.LogCtxSlot.Get(ctx)

	err := h.db.PingContext(ctx)

	if err != nil {
		log.Errorf("could not ping database: %v", err)
	}

	return err == nil
}
