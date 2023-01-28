package cmd

import (
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(devCmd)
}

var devCmd = &cobra.Command{
	Use:   "pwd",
	Short: "runs pwd",
	Run: func(c *cobra.Command, args []string) {
		cmd := exec.Command("pwd")
		cmd.Dir = RootDir()
		cmd.Stdout = os.Stdout
		cmd.Run()
	},
}
