package util

import (
	"bytes"
	"testing"
	"time"
)

type testWriter struct {
	buf bytes.Buffer
}

func (tw *testWriter) Write(p []byte) (n int, err error) {
	return tw.buf.Write(p)
}

func TestLogger_NewLogger(t *testing.T) {
	for _, test := range []struct {
		name      string
		formatter int
		time      time.Time
		log       string
		want      string
	}{
		{
			name:      "text format",
			formatter: FormatterText,
			time:      time.Date(2023, time.June, 10, 9, 25, 10, 0, time.UTC),
			log:       "hello world",
			want:      "time=\"2023-06-10T09:25:10Z\" level=info msg=\"hello world\"\n",
		}, {
			name:      "json format",
			formatter: FormatterJson,
			time:      time.Date(2023, time.June, 10, 9, 25, 10, 0, time.UTC),
			log:       "hello world",
			want:      "{\"level\":\"info\",\"msg\":\"hello world\",\"time\":\"2023-06-10T09:25:10Z\"}\n",
		}, {
			name:      "invalid format",
			formatter: -1,
			time:      time.Date(2023, time.June, 10, 9, 25, 10, 0, time.UTC),
			log:       "hello world",
			want:      "time=\"2023-06-10T09:25:10Z\" level=info msg=\"hello world\"\n",
		},
	} {
		t.Run(test.name, func(t *testing.T) {
			writer := &testWriter{}

			logger := NewLogger(test.formatter)
			logger.SetTime(test.time)
			logger.SetOutput(writer)
			logger.Infof(test.log)

			if got := writer.buf.String(); got != test.want {
				t.Errorf("Infof(%q) = %q, want %q", test.log, got, test.want)
			}
		})
	}
}
