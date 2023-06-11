package db

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
				host:     "host",
				port:     1234,
				dbName:   "dbName",
				user:     "user",
				password: "password",
			},
			want: "host=host port=1234 dbname=dbName user=user password=password",
		},
		{
			name: "excluding host returns error",
			params: DsnParams{
				host: "",
			},
			wantErr: true,
		}, {
			name: "includes host",
			params: DsnParams{
				host: "host",
				port: 1234,
			},
			want: "host=host port=1234",
		}, {
			name: "defaults port",
			params: DsnParams{
				host: "host",
			},
			want: "host=host port=5432",
		}, {
			name: "includes dbName",
			params: DsnParams{
				host:   "host",
				dbName: "dbName",
			},
			want: "host=host port=5432 dbname=dbName",
		}, {
			name: "includes user",
			params: DsnParams{
				host: "host",
				user: "user",
			},
			want: "host=host port=5432 user=user",
		}, {
			name: "includes password",
			params: DsnParams{
				host:     "host",
				password: "password",
			},
			want: "host=host port=5432 password=password",
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
