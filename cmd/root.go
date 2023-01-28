package cmd

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"runtime"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "stringsync",
	Short: "stringsync is an application that teaches guitar",
}

// Execute runs the command.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// RootDir calculates the root directory of the project.
func RootDir() string {
	_, b, _, _ := runtime.Caller(0)
	d := path.Join(path.Dir(b))
	return filepath.Dir(d)
}
