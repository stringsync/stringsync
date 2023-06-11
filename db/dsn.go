package db

import (
	"errors"
	"fmt"
	"strings"
)

// DsnParams are the parameters needed for GetDsn.
type DsnParams struct {
	host     string
	port     int
	dbName   string
	user     string
	password string
}

// GetPostgresDsn calculates the Data Source Name for connecting to a Postgres database.
//
// See https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-PARAMKEYWORDS
func GetPostgresDsn(params DsnParams) (string, error) {
	parts := []string{}

	host := params.host
	if host == "" {
		return "", errors.New("must provide a host")
	}
	parts = append(parts, (fmt.Sprintf("host=%s", host)))

	port := params.port
	if port == 0 {
		port = 5432
	}
	parts = append(parts, (fmt.Sprintf("port=%d", port)))

	dbName := params.dbName
	if dbName != "" {
		parts = append(parts, (fmt.Sprintf("dbname=%s", dbName)))
	}

	user := params.user
	if user != "" {
		parts = append(parts, (fmt.Sprintf("user=%s", user)))
	}

	password := params.password
	if password != "" {
		parts = append(parts, (fmt.Sprintf("password=%s", password)))
	}

	return strings.Join(parts, " "), nil
}
