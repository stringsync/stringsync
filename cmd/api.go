package cmd

import (
	"stringsync/api"
	"stringsync/util"

	"github.com/spf13/cobra"
)

var (
	apiAllowedOrigins []string
)

func init() {
	rootCmd.AddCommand(apiCmd)

	apiCmd.Flags().StringArrayVar(&apiAllowedOrigins, "allowed_origin", []string{}, "allowed CORS origin")
}

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Runs the api server",
	RunE: func(c *cobra.Command, args []string) error {
		return api.Start(api.Config{
			Port:           util.MustGetEnvInt("APP_PORT"),
			AllowedOrigins: apiAllowedOrigins,
			DBDriver:       "postgres",
			DBHost:         util.MustGetEnvString("DB_HOST"),
			DBPort:         util.MustGetEnvInt("DB_PORT"),
			DBName:         util.MustGetEnvString("DB_NAME"),
			DBUser:         util.MustGetEnvString("DB_USERNAME"),
			DBPassword:     util.MustGetEnvString("DB_PASSWORD"),
		})
	},
}
