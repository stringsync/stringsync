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

	migrateCmd.Flags().StringVar(&migrateDriver, "driver", "", "database driver")
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
		config := database.Config{
			Driver:   migrateDriver,
			Host:     migrateHost,
			Port:     migratePort,
			DBName:   migrateDbName,
			User:     migrateUser,
			Password: migratePassword,
		}

		if err := database.Ready(config, 30*time.Second); err != nil {
			log.Fatal(err)
		}

		if err := database.Migrate(config); err != nil {
			log.Fatal(err)
		}

		if migrateSeed {
			if err := database.Seed(config); err != nil {
				log.Fatal(err)
			}
		}
	},
}
