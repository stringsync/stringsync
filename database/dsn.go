package database

import (
	"errors"
	"fmt"
	"strings"
)

// GetDataSourceName returns the data source name for the config.
func GetDataSourceName(config Config) (string, error) {
	switch config.Driver {
	case "postgres":
		return getPostgresDataSourceName(config)
	default:
		return "", fmt.Errorf("unsupported driver: %v", config.Driver)
	}
}

// getPostgresDataSourceName calculates the Data Source Name for connecting to a Postgres database.
//
// See https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-PARAMKEYWORDS
func getPostgresDataSourceName(config Config) (string, error) {
	parts := []string{}

	host := config.Host
	if host == "" {
		return "", errors.New("must provide a host")
	}
	parts = append(parts, (fmt.Sprintf("host=%s", host)))

	port := config.Port
	if port == 0 {
		port = 5432
	}
	parts = append(parts, (fmt.Sprintf("port=%d", port)))

	dbName := config.DBName
	if dbName != "" {
		parts = append(parts, (fmt.Sprintf("dbname=%s", dbName)))
	}

	user := config.User
	if user != "" {
		parts = append(parts, (fmt.Sprintf("user=%s", user)))
	}

	password := config.Password
	if password != "" {
		parts = append(parts, (fmt.Sprintf("password=%s", password)))
	}

	parts = append(parts, "sslmode=disable")

	return strings.Join(parts, " "), nil
}
