package cmd

import (
	"log"
	"os"
	"os/exec"
	"stringsync/database"
	"stringsync/util"
	"time"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(testCmd)
}

var testCmd = &cobra.Command{
	Use:   "test",
	Short: "Runs tests",
	RunE: func(c *cobra.Command, args []string) error {
		config := database.Config{
			Driver:   "postgres",
			Host:     util.MustGetEnvString("DB_HOST"),
			Port:     util.MustGetEnvInt("DB_PORT"),
			DBName:   util.MustGetEnvString("DB_NAME"),
			User:     util.MustGetEnvString("DB_USERNAME"),
			Password: util.MustGetEnvString("DB_PASSWORD"),
		}

		if err := database.Ready(config, 30*time.Second); err != nil {
			log.Fatal(err)
		}

		if err := database.Migrate(config); err != nil {
			log.Fatal(err)
		}

		cmd := exec.Command("go", "test", "./...")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			os.Exit(1)
		}

		return nil
	},
}
