package util

import (
	"bytes"
	"strings"
	"testing"
	"time"
)

var testTime = time.Date(2023, time.June, 10, 9, 25, 10, 0, time.UTC)

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
			time:      testTime,
			log:       "foo",
			want:      "time=\"2023-06-10T09:25:10Z\" level=info msg=foo\n",
		}, {
			name:      "json format",
			formatter: FormatterJson,
			time:      testTime,
			log:       "foo",
			want:      "{\"level\":\"info\",\"msg\":\"foo\",\"time\":\"2023-06-10T09:25:10Z\"}\n",
		}, {
			name:      "invalid format",
			formatter: -1,
			time:      testTime,
			log:       "foo",
			want:      "time=\"2023-06-10T09:25:10Z\" level=info msg=foo\n",
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

func TestLogger_NewChild(t *testing.T) {
	writer := &testWriter{}

	logger := NewLogger(FormatterText)
	logger.SetTime(testTime)
	logger.SetOutput(writer)

	child1 := logger.NewChild()
	child1.SetLocalField("secret", "foo")

	child2 := logger.NewChild()
	child2.SetLocalField("secret", "bar")

	child1.Infof("hello")
	got1 := writer.buf.String()

	writer.buf.Reset()

	child2.Infof("hello")
	got2 := writer.buf.String()

	if got1 == got2 {
		t.Errorf("want got1 != got2, got %q", got1)
	}
}

func TestLogger_SetOutput(t *testing.T) {
	writer := &testWriter{}
	logger := NewLogger(FormatterText)

	logger.SetOutput(writer)
	logger.Infof("foo")

	if got := writer.buf.Len(); got == 0 {
		t.Errorf("writer.buf.Len() = %v, want > 0", got)
	}
}

func TestLogger_SetTime(t *testing.T) {
	writer := &testWriter{}
	logger := NewLogger(FormatterText)
	logger.SetOutput(writer)

	logger.SetTime(testTime)
	logger.Infof("foo")

	if got, substr := writer.buf.String(), testTime.Format(time.RFC3339); !strings.Contains(got, substr) {
		t.Errorf("strings.Contains(%q, %q) = false, want true", got, substr)
	}
}

func TestLogger_SetGlobalField(t *testing.T) {
	t.Run("parent", func(t *testing.T) {
		writer := &testWriter{}
		logger := NewLogger(FormatterText)
		logger.SetOutput(writer)

		logger.SetGlobalField("foo", "bar")
		logger.Infof("hello")

		if got := writer.buf.String(); !strings.Contains(got, "foo=bar") {
			t.Errorf("strings.Contains(%q, \"foo=bar\") = false, want true", got)
		}
	})

	t.Run("child", func(t *testing.T) {
		writer := &testWriter{}
		logger := NewLogger(FormatterText)
		logger.SetOutput(writer)

		logger.SetGlobalField("foo", "bar")
		child := logger.NewChild()
		child.Infof("hello")

		if got := writer.buf.String(); !strings.Contains(got, "foo=bar") {
			t.Errorf("strings.Contains(%q, \"foo=bar\") = false, want true", got)
		}
	})
}

func TestLogger_SetLocalField(t *testing.T) {
	t.Run("parent", func(t *testing.T) {
		writer := &testWriter{}
		logger := NewLogger(FormatterText)
		logger.SetOutput(writer)

		logger.SetLocalField("foo", "bar")
		logger.Infof("hello")

		if got := writer.buf.String(); !strings.Contains(got, "foo=bar") {
			t.Errorf("strings.Contains(%q, \"foo=bar\") = false, want true", got)
		}
	})

	t.Run("child", func(t *testing.T) {
		writer := &testWriter{}
		logger := NewLogger(FormatterText)
		logger.SetOutput(writer)

		logger.SetLocalField("foo", "bar")
		child := logger.NewChild()
		child.Infof("hello")

		if got := writer.buf.String(); strings.Contains(got, "foo=bar") {
			t.Errorf("strings.Contains(%q, \"foo=bar\") = true, want false", got)
		}
	})
}
