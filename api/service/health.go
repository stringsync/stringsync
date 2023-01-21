package service

import "context"

// Health validates that the server is running.
func Health(ctx context.Context) (string, error) {
	return "ok", nil
}
