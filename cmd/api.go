package cmd

import (
	"stringsync/api"

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
	Short: "runs the api server",
	RunE: func(c *cobra.Command, args []string) error {
		return api.Start(apiPort, apiAllowedOrigins)
	},
}
