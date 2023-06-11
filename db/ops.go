package db

import (
	"database/sql"
	"fmt"
	"log"
	"os/exec"
)

const (
	migrationsDir       = "db/migrations"
	migrationsTableName = "_db_migrations"
	seedsDir            = "db/seeds"
	seedsTableName      = "_db_seeds"
)

// CanConnect returns whether the database can be connected to.
func CanConnect(driver, dsn string) bool {
	db, err := sql.Open(driver, dsn)
	if err != nil {
		return false
	}
	db.Close()
	return true
}

// Migrate runs a DDL migration against the database to the latest version.
func Migrate(dsn string) {
	goose("-dir", migrationsDir, "-table", migrationsTableName, dsn, "up")
}

// Migrate runs a DML migration against the database to the latest version.
func Seed(dsn string) {
	goose("-dir", seedsDir, "-table", seedsTableName, dsn, "up")
}

// goose runs the goose binary.
func goose(args ...string) {
	cmd := exec.Command("goose", args...)

	out, err := cmd.Output()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(out))
}
