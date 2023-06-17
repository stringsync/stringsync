package db

import (
	"errors"
	"fmt"
	"strings"
)

// DsnParams are the parameters needed for GetDsn.
type DsnParams struct {
	Host     string
	Port     int
	DbName   string
	User     string
	Password string
}

// GetPostgresDsn calculates the Data Source Name for connecting to a Postgres database.
//
// See https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-PARAMKEYWORDS
func GetPostgresDsn(params DsnParams) (string, error) {
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

	dbName := params.DbName
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
