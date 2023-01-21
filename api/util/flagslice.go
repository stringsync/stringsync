package util

import "strings"

// FlagSlice is a repeated flag stored in a slice.
type FlagSlice []string

// String converts a FlagSlice into a string.
func (f *FlagSlice) String() string {
	return strings.Join(*f, ",")
}

// Set appends a string to the underlying slice.
func (f *FlagSlice) Set(s string) error {
	*f = append(*f, s)
	return nil
}
