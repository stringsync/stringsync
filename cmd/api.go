package cmd

import (
	"stringsync/api"

	"github.com/spf13/cobra"
)

var (
	port           int
	allowedOrigins []string
)

func init() {
	rootCmd.AddCommand(apiCmd)

	apiCmd.Flags().IntVar(&port, "port", 8080, "the port to run the server on")
	apiCmd.Flags().StringArrayVar(&allowedOrigins, "allowed_origin", []string{}, "allowed CORS origin")
}

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "runs the api server",
	RunE: func(c *cobra.Command, args []string) error {
		return api.Start(port, allowedOrigins)
	},
}
