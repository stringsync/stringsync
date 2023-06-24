package util

import (
	"fmt"
	"os"
	"strconv"
)

// GetEnvString returns a string from the env.
func GetEnvString(key string) string {
	return os.Getenv(key)
}

// GetEnvInt returns an int from the env.
func GetEnvInt(key string) int {
	str := os.Getenv(key)
	if str == "" {
		return 0
	}

	val, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return 0
	}
	return int(val)
}

// MustGetEnvString returns a string from the env.
// It will panic if the env is missing.
func MustGetEnvString(key string) string {
	val := os.Getenv(key)
	if val == "" {
		panic(fmt.Sprintf("Empty env key %q", key))
	}
	return val
}

// MustGetEnvInt returns an int64 from the env.
// It will panic if the env is missing or invalid.
func MustGetEnvInt(key string) int {
	str := os.Getenv(key)
	if str == "" {
		panic(fmt.Sprintf("Empty env key %q", key))
	}

	val, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		panic(fmt.Sprintf("Could not parse env key %q: %v", key, err))
	}

	return int(val)
}
