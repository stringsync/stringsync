package util

import (
	"reflect"
	"testing"
)

func TestFlagSlice_Set(t *testing.T) {
	fs := &FlagSlice{}

	fs.Set("foo")
	fs.Set("bar")

	want := FlagSlice{"foo", "bar"}
	if !reflect.DeepEqual(*fs, want) {
		t.Errorf("*fs = %v, want %v", *fs, want)
	}
}

func TestFlagSlice_String(t *testing.T) {
	fs := &FlagSlice{}

	fs.Set("foo")
	fs.Set("bar")

	if got, want := fs.String(), "foo,bar"; got != want {
		t.Errorf("String() = %q, want %q", got, want)
	}
}
