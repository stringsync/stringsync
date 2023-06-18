package cmd

import (
	"stringsync/api"
	"stringsync/util"

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
			DbHost:         util.MustGetEnvString("DB_HOST"),
			DbPort:         util.MustGetEnvInt("DB_PORT"),
			DbName:         util.MustGetEnvString("DB_NAME"),
			DbUser:         util.MustGetEnvString("DB_USERNAME"),
			DbPassword:     util.MustGetEnvString("DB_PASSWORD"),
		})
	},
}
