package database

import (
	"testing"
)

func TestGetPostgresDsn(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  DsnParams
		want    string
		wantErr bool
	}{
		{
			name: "calculates fully qualified dsns",
			params: DsnParams{
				Host:     "host",
				Port:     1234,
				DbName:   "dbName",
				User:     "user",
				Password: "password",
			},
			want: "host=host port=1234 dbname=dbName user=user password=password sslmode=disable",
		},
		{
			name: "excluding host returns error",
			params: DsnParams{
				Host: "",
			},
			wantErr: true,
		}, {
			name: "includes host",
			params: DsnParams{
				Host: "host",
				Port: 1234,
			},
			want: "host=host port=1234 sslmode=disable",
		}, {
			name: "defaults port",
			params: DsnParams{
				Host: "host",
			},
			want: "host=host port=5432 sslmode=disable",
		}, {
			name: "includes dbName",
			params: DsnParams{
				Host:   "host",
				DbName: "dbName",
			},
			want: "host=host port=5432 dbname=dbName sslmode=disable",
		}, {
			name: "includes user",
			params: DsnParams{
				Host: "host",
				User: "user",
			},
			want: "host=host port=5432 user=user sslmode=disable",
		}, {
			name: "includes password",
			params: DsnParams{
				Host:     "host",
				Password: "password",
			},
			want: "host=host port=5432 password=password sslmode=disable",
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			got, gotErr := GetPostgresDsn(test.params)

			if hasErr := gotErr != nil; hasErr != test.wantErr {
				t.Errorf("gotErr = %v, wantErr = %t", gotErr, test.wantErr)
			}

			if got != test.want {
				t.Errorf("GetDsn(%+v) = %q, want %q", test.params, got, test.want)
			}
		})
	}
}
