package cmd

import (
	"log"
	"stringsync/db"
	"time"

	"github.com/spf13/cobra"
)

var (
	migrateHost     string
	migratePort     int
	migrateDbName   string
	migrateUser     string
	migratePassword string
	migrateSeed     bool
)

func init() {
	rootCmd.AddCommand(migrateCmd)

	migrateCmd.Flags().StringVar(&migrateHost, "host", "", "database host")
	migrateCmd.Flags().IntVar(&migratePort, "port", 5432, "database port")
	migrateCmd.Flags().StringVar(&migrateDbName, "dbname", "", "database name")
	migrateCmd.Flags().StringVar(&migrateUser, "user", "", "database user")
	migrateCmd.Flags().StringVar(&migratePassword, "password", "", "database password")
	migrateCmd.Flags().BoolVar(&migrateSeed, "seed", false, "seed the database after migrating")
}

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Migrates the database",
	Run: func(c *cobra.Command, args []string) {
		dsn, err := db.GetPostgresDsn(db.DsnParams{
			Host:     migrateHost,
			Port:     migratePort,
			DbName:   migrateDbName,
			User:     migrateUser,
			Password: migratePassword,
		})
		if err != nil {
			log.Fatal(err)
		}

		err = db.Ready("postgres", dsn, 30*time.Second)
		if err != nil {
			log.Fatal(err)
		}

		err = db.Migrate(dsn)
		if err != nil {
			log.Fatal(err)
		}

		if migrateSeed {
			err = db.Seed(dsn)
			if err != nil {
				log.Fatal(err)
			}
		}
	},
}
