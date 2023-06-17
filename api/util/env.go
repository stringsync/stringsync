package util

import (
	"fmt"
	"os"
	"strconv"
)

// MustGetEnvString returns a string from the env.
// It will panic if the env is missing.
func MustGetEnvString(key string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		panic(fmt.Sprintf("Missing env key %q", key))
	}
	if val == "" {
		panic(fmt.Sprintf("Empty env key %q", key))
	}
	return val
}

// MustGetEnvInt returns an int64 from the env.
// It will panic if the env is missing or invalid.
func MustGetEnvInt(key string) int64 {
	str, ok := os.LookupEnv(key)
	if !ok {
		panic(fmt.Sprintf("Missing env key %q", key))
	}
	val, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		panic(fmt.Sprintf("Could not parse env key %q: %v", key, err))
	}
	return val
}
