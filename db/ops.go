package db

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"time"

	_ "github.com/lib/pq"
)

const (
	migrationsDir       = "db/migrations"
	migrationsTableName = "_db_migrations"
	seedsDir            = "db/seeds"
	seedsTableName      = "_db_seeds"
)

// Ready returns whether the database is ready within the duration.
func Ready(driver, dsn string, duration time.Duration) error {
	start := time.Now()

	fmt.Print("Waiting for db connection...")
	defer fmt.Print("\n")

	for {
		if CanConnect(driver, dsn) {
			fmt.Print("ready")
			return nil
		}

		if time.Since(start) >= duration {
			return errors.New("db connection timed out")
		}

		fmt.Print(".")
		time.Sleep(1 * time.Second)
	}
}

// CanConnect returns whether the database can be connected to.
func CanConnect(driver, dsn string) bool {
	db, err := sql.Open(driver, dsn)
	if err != nil {
		return false
	}

	defer db.Close()

	_, err = db.Exec("SELECT NOW();")
	return err == nil
}

// Migrate runs a DDL migration against the database to the latest version.
func Migrate(dsn string) error {
	return up(migrationsDir, migrationsTableName, dsn)
}

// Migrate runs a DML migration against the database to the latest version.
func Seed(dsn string) error {
	return up(seedsDir, seedsTableName, dsn)
}

// up runs the goose up command.
func up(dir, table, dsn string) error {
	cmd := exec.Command("goose", "-dir", dir, "-table", table, "postgres", dsn, "up")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}