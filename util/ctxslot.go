package util

import "context"

type CtxKey string

type CtxSlot[T any] struct {
	key CtxKey
}

// Put creates a new context.Context with a value.
func (c *CtxSlot[T]) Put(ctx context.Context, val T) context.Context {
	return context.WithValue(ctx, c.key, val)
}

// Get returns the stored value from a context.Context.
func (c *CtxSlot[T]) Get(ctx context.Context) T {
	return ctx.Value(c.key).(T)
}
