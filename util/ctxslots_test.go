package util

import (
	"context"
	"testing"
)

func TestNewCtxSlot(t *testing.T) {
	defer func() {
		if gotPanic := recover(); gotPanic != nil {
			t.Errorf("got panic, expected no panic: %v", gotPanic)
		}
	}()

	NewCtxSlot[string]("foo")
}

func TestCtxSlot_Put(t *testing.T) {
	t.Run("puts a ctx value", func(t *testing.T) {
		slot := NewCtxSlot[string]("foo")

		ctx := context.Background()
		ctx = slot.Put(ctx, "bar")

		gotVal, gotOk := slot.Get(ctx)
		wantVal, wantOk := "bar", true
		if gotVal != wantVal || gotOk != wantOk {
			t.Errorf("slot.Get(%v) = %v, %v, want: %q, %v", ctx, gotVal, gotOk, wantVal, wantOk)
		}
	})

	t.Run("overwrites an existing ctx value", func(t *testing.T) {
		slot := NewCtxSlot[string]("foo")

		ctx := context.Background()
		ctx = slot.Put(ctx, "bar")
		ctx = slot.Put(ctx, "baz")

		gotVal, gotOk := slot.Get(ctx)
		wantVal, wantOk := "baz", true
		if gotVal != wantVal || gotOk != wantOk {
			t.Errorf("slot.Get(%v) = %v, %v, want: %q, %v", ctx, gotVal, gotOk, wantVal, wantOk)
		}
	})
}

func TestCtxSlot_Get(t *testing.T) {
	t.Run("returns the ctx value", func(t *testing.T) {
		slot := NewCtxSlot[string]("foo")

		ctx := context.Background()
		ctx = slot.Put(ctx, "bar")

		gotVal, gotOk := slot.Get(ctx)
		wantVal, wantOk := "bar", true
		if gotVal != wantVal || gotOk != wantOk {
			t.Errorf("slot.Get(%v) = %v, %v, want: %q, %v", ctx, gotVal, gotOk, wantVal, wantOk)
		}
	})

	t.Run("is not ok when no ctx value", func(t *testing.T) {
		slot := NewCtxSlot[string]("foo")

		ctx := context.Background()

		gotVal, gotOk := slot.Get(ctx)
		wantVal, wantOk := "", false
		if gotVal != wantVal || gotOk != wantOk {
			t.Errorf("slot.Get(%v) = %v, %v, want: %q, %v", ctx, gotVal, gotOk, wantVal, wantOk)
		}
	})
}
