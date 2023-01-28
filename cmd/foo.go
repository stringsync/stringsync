package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(fooCmd)
}

var fooCmd = &cobra.Command{
	Use:   "foo",
	Short: "foo command",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("hello world")
	},
}
