package dsn

import (
	"errors"
	"fmt"
	"strings"
)

type Params struct {
	Driver   string
	Host     string
	Port     int
	DBName   string
	User     string
	Password string
}

// GetDataSourceName returns the data source name for the config.
func GetDataSourceName(params Params) (string, error) {
	switch params.Driver {
	case "postgres":
		return getPostgresDataSourceName(params)
	default:
		return "", fmt.Errorf("unsupported driver: %v", params.Driver)
	}
}

// getPostgresDataSourceName calculates the Data Source Name for connecting to a Postgres database.
//
// See https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-PARAMKEYWORDS
func getPostgresDataSourceName(params Params) (string, error) {
	parts := []string{}

	host := params.Host
	if host == "" {
		return "", errors.New("must provide a host")
	}
	parts = append(parts, (fmt.Sprintf("host=%s", host)))

	port := params.Port
	if port == 0 {
		port = 5432
	}
	parts = append(parts, (fmt.Sprintf("port=%d", port)))

	dbName := params.DBName
	if dbName != "" {
		parts = append(parts, (fmt.Sprintf("dbname=%s", dbName)))
	}

	user := params.User
	if user != "" {
		parts = append(parts, (fmt.Sprintf("user=%s", user)))
	}

	password := params.Password
	if password != "" {
		parts = append(parts, (fmt.Sprintf("password=%s", password)))
	}

	parts = append(parts, "sslmode=disable")

	return strings.Join(parts, " "), nil
}
