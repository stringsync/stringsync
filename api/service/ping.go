package service

import "context"

type PingRequest struct{}

type PingResponse struct {
	Message string `json:"message"`
}

func Ping(ctx context.Context, r PingRequest) PingResponse {
	return PingResponse{Message: "pong"}
}
