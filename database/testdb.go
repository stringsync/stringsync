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
	// config.DBName is purposely excluded.
	db, err := Connect(config.WithoutDBName())
	if err != nil {
		log.Fatal(err)
	}

	testDBName := fmt.Sprintf("test_%v", randID())

	// We need to create the query using fmt.
	// https://github.com/lib/pq/issues/694
	if _, err = db.Exec(fmt.Sprintf("CREATE DATABASE %v TEMPLATE %v", testDBName, config.DBName)); err != nil {
		log.Fatal(err)
	}

	if testDB, err = Connect(config.WithDBName(testDBName)); err != nil {
		log.Fatal(err)
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
