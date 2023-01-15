package util

import "strings"

type FlagSlice []string

func (f *FlagSlice) String() string {
	return strings.Join(*f, ",")
}

func (f *FlagSlice) Set(s string) error {
	*f = append(*f, s)
	return nil
}
