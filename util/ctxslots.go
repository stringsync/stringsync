package util

import (
	"context"
	"fmt"
	"runtime"
)

var (
	RequestIDCtxSlot = NewCtxSlot[string]("requestID")
	LogCtxSlot       = NewCtxSlot[*Logger]("log")
)

// ctxKey is the key to retrieve a context value with.
type ctxKey string

// CtxSlot is a container for managing state inside a context.Context.
type CtxSlot[T any] struct {
	key ctxKey
}

// NewCtxSlot creates a new CtxSlot. This is intended to only be called at the
// top level.
func NewCtxSlot[T any](name string) *CtxSlot[T] {
	_, file, line, _ := runtime.Caller(0)
	key := ctxKey(fmt.Sprintf("%v_%v@L%v", name, file, line))
	return &CtxSlot[T]{key}
}

// Put creates a new context.Context with a value.
func (c *CtxSlot[T]) Put(ctx context.Context, val T) context.Context {
	return context.WithValue(ctx, c.key, val)
}

// Get returns the stored value from a context.Context.
func (c *CtxSlot[T]) Get(ctx context.Context) T {
	return ctx.Value(c.key).(T)
}
