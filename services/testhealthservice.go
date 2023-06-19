package services

import "context"

type TestHealthService struct {
	checkDBHealthResult bool
}

func NewTestHealthService() *TestHealthService {
	return &TestHealthService{}
}

func (t *TestHealthService) CheckDBHealth(ctx context.Context) bool {
	return t.checkDBHealthResult
}

func (t *TestHealthService) SetCheckDBHealth(result bool) {
	t.checkDBHealthResult = result
}
