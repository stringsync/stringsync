package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"stringsync/database/internal/dsn"
	"time"

	_ "github.com/lib/pq"
)

const (
	migrationsDir       = "database/migrations"
	migrationsTableName = "_db_migrations"
	seedsDir            = "database/seeds"
	seedsTableName      = "_db_seeds"
)

// Connect establishes a connection with the database.
func Connect(config Config) (*sql.DB, error) {
	dsn, err := dsn.GetDataSourceName(toDsnParams(config))
	if err != nil {
		log.Fatal(err)
	}
	return sql.Open(config.Driver, dsn)
}

// Ready returns whether the database is ready within the duration.
func Ready(config Config, duration time.Duration) error {
	start := time.Now()

	fmt.Print("Waiting for db connection...")
	defer fmt.Print("\n")

	for {
		if CanConnect(config) {
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
func CanConnect(config Config) bool {
	db, err := Connect(config)
	if err != nil {
		return false
	}
	defer db.Close()
	return db.Ping() == nil
}

// Migrate runs a DDL migration against the database to the latest version.
func Migrate(config Config) error {
	return up(config, migrationsDir, migrationsTableName)
}

// Migrate runs a DML migration against the database to the latest version.
func Seed(config Config) error {
	return up(config, seedsDir, seedsTableName)
}

// up runs the goose up command.
func up(config Config, dir, table string) error {
	dsn, err := dsn.GetDataSourceName(toDsnParams(config))
	if err != nil {
		return err
	}

	cmd := exec.Command("goose", "-dir", dir, "-table", table, config.Driver, dsn, "up")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func toDsnParams(config Config) dsn.Params {
	return dsn.Params{
		Driver:   config.Driver,
		Host:     config.Host,
		Port:     config.Port,
		DBName:   config.DBName,
		User:     config.User,
		Password: config.Password,
	}
}
