package database

import (
	"testing"
)

func TestGetPostgresDsn(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  DataSourceNameParams
		want    string
		wantErr bool
	}{
		{
			name: "calculates fully qualified dsns",
			params: DataSourceNameParams{
				Host:     "host",
				Port:     1234,
				DBName:   "dbName",
				User:     "user",
				Password: "password",
			},
			want: "host=host port=1234 dbname=dbName user=user password=password sslmode=disable",
		},
		{
			name: "excluding host returns error",
			params: DataSourceNameParams{
				Host: "",
			},
			wantErr: true,
		}, {
			name: "includes host",
			params: DataSourceNameParams{
				Host: "host",
				Port: 1234,
			},
			want: "host=host port=1234 sslmode=disable",
		}, {
			name: "defaults port",
			params: DataSourceNameParams{
				Host: "host",
			},
			want: "host=host port=5432 sslmode=disable",
		}, {
			name: "includes dbName",
			params: DataSourceNameParams{
				Host:   "host",
				DBName: "dbName",
			},
			want: "host=host port=5432 dbname=dbName sslmode=disable",
		}, {
			name: "includes user",
			params: DataSourceNameParams{
				Host: "host",
				User: "user",
			},
			want: "host=host port=5432 user=user sslmode=disable",
		}, {
			name: "includes password",
			params: DataSourceNameParams{
				Host:     "host",
				Password: "password",
			},
			want: "host=host port=5432 password=password sslmode=disable",
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			got, gotErr := GetPostgresDataSourceName(test.params)

			if hasErr := gotErr != nil; hasErr != test.wantErr {
				t.Errorf("gotErr = %v, wantErr = %t", gotErr, test.wantErr)
			}

			if got != test.want {
				t.Errorf("GetDsn(%+v) = %q, want %q", test.params, got, test.want)
			}
		})
	}
}
