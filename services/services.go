package services

import "context"

// CheckDBHealth returns whether the DB can be pinged.
type HealthService interface {
	CheckDBHealth(ctx context.Context) bool
}
