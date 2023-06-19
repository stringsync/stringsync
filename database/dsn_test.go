package database

import (
	"testing"
)

func TestGetDataSourceName(t *testing.T) {
	for _, test := range []struct {
		name    string
		config  Config
		want    string
		wantErr bool
	}{
		{
			name: "calculates fully qualified dsns",
			config: Config{
				Driver:   "postgres",
				Host:     "host",
				Port:     1234,
				DBName:   "dbName",
				User:     "user",
				Password: "password",
			},
			want: "host=host port=1234 dbname=dbName user=user password=password sslmode=disable",
		},
		{
			name: "returns error when excluding host",
			config: Config{
				Driver: "postgres",
				Host:   "",
			},
			wantErr: true,
		}, {
			name: "returns error when excluding driver",
			config: Config{
				Driver: "",
				Host:   "host",
			},
			wantErr: true,
		}, {
			name: "includes host",
			config: Config{
				Driver: "postgres",
				Host:   "host",
				Port:   1234,
			},
			want: "host=host port=1234 sslmode=disable",
		}, {
			name: "defaults port",
			config: Config{
				Driver: "postgres",
				Host:   "host",
			},
			want: "host=host port=5432 sslmode=disable",
		}, {
			name: "includes dbName",
			config: Config{
				Driver: "postgres",
				Host:   "host",
				DBName: "dbName",
			},
			want: "host=host port=5432 dbname=dbName sslmode=disable",
		}, {
			name: "includes user",
			config: Config{
				Driver: "postgres",
				Host:   "host",
				User:   "user",
			},
			want: "host=host port=5432 user=user sslmode=disable",
		}, {
			name: "includes password",
			config: Config{
				Driver:   "postgres",
				Host:     "host",
				Password: "password",
			},
			want: "host=host port=5432 password=password sslmode=disable",
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			got, gotErr := GetDataSourceName(test.config)

			if hasErr := gotErr != nil; hasErr != test.wantErr {
				t.Errorf("gotErr = %v, wantErr = %t", gotErr, test.wantErr)
			}

			if got != test.want {
				t.Errorf("GetDsn(%+v) = %q, want %q", test.config, got, test.want)
			}
		})
	}
}
