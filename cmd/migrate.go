package cmd

import (
	"stringsync/api"

	"github.com/spf13/cobra"
)

var (
	migrateName     string
	migratePort     int
	migratePassword string
)

func init() {
	rootCmd.AddCommand(migrateCmd)

	migrateCmd.Flags().StringVar(&migrateName, "name", "", "database name")
	migrateCmd.Flags().IntVar(&migratePort, "port", 5432, "database port")
	migrateCmd.Flags().StringVar(&migratePassword, "password", "", "database password")
}

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "migrates the database",
	RunE: func(c *cobra.Command, args []string) error {
		return api.Start(apiPort, apiAllowedOrigins)
	},
}
