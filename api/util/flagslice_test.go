package util

import "testing"

func TestFlagSlice(t *testing.T) {
	fs := &FlagSlice{}

	fs.Set("foo")
	fs.Set("bar")

	if got, want := fs.String(), "foo,bar"; got != want {
		t.Errorf("String() = %q, want %q", got, want)
	}
}
