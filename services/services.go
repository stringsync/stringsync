package services

import "context"

type HealthService interface {
	IsDbHealthy(ctx context.Context) bool
}
