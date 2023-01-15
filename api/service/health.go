package service

import "context"

func Health(ctx context.Context) (string, error) {
	return "ok", nil
}
