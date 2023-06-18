package ctxkey

import (
	"context"
	"testing"
)

func TestCtxKey(t *testing.T) {
	key := CtxKey("foo")
	value := "bar"

	ctx := context.Background()
	ctx = context.WithValue(ctx, key, value)

	want := value
	got := ctx.Value(key)
	if got != want {
		t.Errorf("ctx.Value(%q) = %q, want %q", key, got, want)
	}
}
