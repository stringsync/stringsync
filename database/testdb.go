package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/google/uuid"
)

func CreateTestDB(config Config) (testDB *sql.DB, cleanup func()) {
	if config.Driver != "postgres" {
		log.Fatalf("database driver not supported: %v", config.Driver)
	}

	// config.DBName is purposely excluded.
	dsn, err := GetPostgresDataSourceName(DataSourceNameParams{
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

	testDBName := fmt.Sprintf("test_%v", uuid.NewString())

	query := fmt.Sprintf("CREATE DATABASE %v TEMPLATE %v;", testDBName, config.DBName)
	if _, err = db.Exec(query); err != nil {
		log.Fatalf("could not execute query: %v", err)
	}

	testDSN, err := GetPostgresDataSourceName(DataSourceNameParams{
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
		if _, err := db.Exec("DROP DATABASE IF EXISTS %v;", testDBName); err != nil {
			log.Printf("could not drop test DB %q: %v", testDBName, err)
		}
		db.Close()
	}

	return testDB, cleanup
}
