package database

import (
	"os"
	"reflect"
	"testing"
)

func setup(env map[string]string) (cleanup func()) {
	og := make(map[string]string)
	for k, v := range env {
		og[k] = os.Getenv(k)
		os.Setenv(k, v)
	}
	return func() {
		for k, v := range og {
			os.Setenv(k, v)
		}
	}
}

func TestConfigFromEnv(t *testing.T) {
	for _, test := range []struct {
		name string
		env  map[string]string
		want Config
	}{
		{
			name: "pulls config from the env",
			env: map[string]string{
				"DB_DRIVER":   "DB_DRIVER",
				"DB_HOST":     "DB_HOST",
				"DB_PORT":     "5432",
				"DB_NAME":     "DB_NAME",
				"DB_USERNAME": "DB_USERNAME",
				"DB_PASSWORD": "DB_PASSWORD",
			},
			want: Config{
				Driver:   "DB_DRIVER",
				Host:     "DB_HOST",
				Port:     5432,
				DBName:   "DB_NAME",
				User:     "DB_USERNAME",
				Password: "DB_PASSWORD",
			},
		}, {
			name: "defaults driver to postgres",
			env: map[string]string{
				"DB_HOST":     "DB_HOST",
				"DB_PORT":     "5432",
				"DB_NAME":     "DB_NAME",
				"DB_USERNAME": "DB_USERNAME",
				"DB_PASSWORD": "DB_PASSWORD",
			},
			want: Config{
				Driver:   "postgres",
				Host:     "DB_HOST",
				Port:     5432,
				DBName:   "DB_NAME",
				User:     "DB_USERNAME",
				Password: "DB_PASSWORD",
			},
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			cleanup := setup(test.env)
			defer cleanup()

			if got := ConfigFromEnv(); !reflect.DeepEqual(got, test.want) {
				t.Errorf("ConfigFromEnv() = %v, want %v", got, test.want)
			}
		})
	}
}

func TestWithDBName(t *testing.T) {
	config := Config{}.WithDBName("DB_NAME")
	if got, want := config.DBName, "DB_NAME"; got != want {
		t.Errorf("config.DBName = %q, want %q", got, want)
	}
}
