package database

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func CreateTestDB(config Config) (testDB *sql.DB, cleanup func()) {
	if config.Driver != "postgres" {
		log.Fatalf("database driver not supported: %v", config.Driver)
	}

	// config.DBName is purposely excluded.
	dsn, err := GetDataSourceName(Config{
		Driver:   "postgres",
		Host:     config.Host,
		Port:     config.Port,
		User:     config.User,
		Password: config.Password,
	})
	if err != nil {
		log.Fatalf("could not calculate data source name: %v", err)
	}

	db, err := sql.Open(config.Driver, dsn)
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}

	testDBName := fmt.Sprintf("test_%v", randID())

	// We need to create the query using fmt.
	// https://github.com/lib/pq/issues/694
	if _, err = db.Exec(fmt.Sprintf("CREATE DATABASE %v TEMPLATE %v", testDBName, config.DBName)); err != nil {
		log.Fatalf("could not execute query: %v", err)
	}

	testDSN, err := GetDataSourceName(Config{
		Driver:   "postgres",
		Host:     config.Host,
		Port:     config.Port,
		DBName:   config.DBName,
		User:     config.User,
		Password: config.Password,
	})
	if err != nil {
		log.Fatalf("could not calculate test data source name: %v", err)
	}

	if testDB, err = sql.Open(config.Driver, testDSN); err != nil {
		log.Fatalf("could not connect to test DB: %v", err)
	}

	cleanup = func() {
		testDB.Close()
		// We need to create the query using fmt.
		// https://github.com/lib/pq/issues/694
		if _, err := db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %v", testDBName)); err != nil {
			log.Printf("could not drop test DB %q: %v", testDBName, err)
		}
		db.Close()
	}

	return testDB, cleanup
}

func randID() string {
	id := make([]byte, 16)
	rand.Read(id)
	return hex.EncodeToString(id)
}
