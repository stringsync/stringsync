package cmd

import (
	"log"
	"stringsync/database"
	"time"

	"github.com/spf13/cobra"
)

var (
	migrateDriver   string
	migrateHost     string
	migratePort     int
	migrateDbName   string
	migrateUser     string
	migratePassword string
	migrateSeed     bool
)

func init() {
	rootCmd.AddCommand(migrateCmd)

	migrateCmd.Flags().StringVar(&migrateDriver, "driver", "postgres", "database driver")
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
		dsn, err := database.GetPostgresDsn(database.DsnParams{
			Host:     migrateHost,
			Port:     migratePort,
			DbName:   migrateDbName,
			User:     migrateUser,
			Password: migratePassword,
		})
		if err != nil {
			log.Fatal(err)
		}

		err = database.Ready(migrateDriver, dsn, 30*time.Second)
		if err != nil {
			log.Fatal(err)
		}

		err = database.Migrate(migrateDriver, dsn)
		if err != nil {
			log.Fatal(err)
		}

		if migrateSeed {
			err = database.Seed(migrateDriver, dsn)
			if err != nil {
				log.Fatal(err)
			}
		}
	},
}
