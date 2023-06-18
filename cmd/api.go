package cmd

import (
	"stringsync/api"
	"stringsync/env"

	"github.com/spf13/cobra"
)

var (
	apiPort           int
	apiAllowedOrigins []string
)

func init() {
	rootCmd.AddCommand(apiCmd)

	apiCmd.Flags().IntVar(&apiPort, "port", 8080, "the port to run the server on")
	apiCmd.Flags().StringArrayVar(&apiAllowedOrigins, "allowed_origin", []string{}, "allowed CORS origin")
}

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "Runs the api server",
	RunE: func(c *cobra.Command, args []string) error {
		return api.Start(api.Config{
			Port:           apiPort,
			AllowedOrigins: apiAllowedOrigins,
			DbHost:         env.MustGetEnvString("DB_HOST"),
			DbPort:         env.MustGetEnvInt("DB_PORT"),
			DbName:         env.MustGetEnvString("DB_NAME"),
			DbUser:         env.MustGetEnvString("DB_USERNAME"),
			DbPassword:     env.MustGetEnvString("DB_PASSWORD"),
		})
	},
}
