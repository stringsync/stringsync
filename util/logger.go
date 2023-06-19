package util

import (
	"io"
	"time"

	log "github.com/sirupsen/logrus"
)

const (
	FormatterText = iota
	FormatterJson
)

// Logger is a wrapper around logrus.
type Logger struct {
	logger          *log.Logger
	entry           *log.Entry
	globalFieldHook *globalFieldHook
}

// globalFieldHook is a mechanism to ensure the global fields are set each log.
type globalFieldHook struct {
	data map[string]any
}

// Levels returns the levels that globalFieldHook is valid for.
func (f globalFieldHook) Levels() []log.Level {
	return log.AllLevels
}

// Fire is called when logging at any level.
func (f *globalFieldHook) Fire(entry *log.Entry) error {
	for key, value := range f.data {
		entry.Data[key] = value
	}
	return nil
}

// NewLogger returns a new logger.
func NewLogger(formatter int) *Logger {
	logger := log.New()

	switch formatter {
	case FormatterText:
		logger.SetFormatter(&log.TextFormatter{})
	case FormatterJson:
		logger.SetFormatter(&log.JSONFormatter{})
	default:
		logger.SetFormatter(&log.TextFormatter{})
	}

	g := &globalFieldHook{make(map[string]any)}
	logger.AddHook(g)

	return &Logger{
		logger: logger, entry: log.NewEntry(logger), globalFieldHook: g}
}

// NewChild creates a child logger.
func (l *Logger) NewChild() *Logger {
	return &Logger{logger: l.logger, entry: log.NewEntry(l.logger)}
}

// SetOuput sets the output of the logger.
func (l *Logger) SetOutput(output io.Writer) {
	l.logger.SetOutput(output)
}

// SetTime sets the time of the logger for testing.
func (l *Logger) SetTime(time time.Time) {
	l.entry = l.entry.WithTime(time)
}

// SetGlobalField adds a field to the root logger.
func (l *Logger) SetGlobalField(key string, value any) {
	l.globalFieldHook.data[key] = value
}

// SetLocalField adds a field to the child logger.
func (l *Logger) SetLocalField(key string, value any) {
	l.entry = l.entry.WithField(key, value)
}

// Info creates a log at the INFO level.
func (l *Logger) Info(args ...any) {
	l.entry.Info(args...)
}

// Infof creates a formatted log at the INFO level.
func (l *Logger) Infof(format string, args ...any) {
	l.entry.Infof(format, args...)
}

// Warn creates a log at the WARN level.
func (l *Logger) Warn(args ...any) {
	l.entry.Warn(args...)
}

// Warnf creates a formatted log at the WARN level.
func (l *Logger) Warnf(format string, args ...any) {
	l.entry.Warnf(format, args...)
}

// Error creates a log at the ERROR level.
func (l *Logger) Error(args ...any) {
	l.entry.Error(args...)
}

// Errorf creates a formatted log at the ERROR level.
func (l *Logger) Errorf(format string, args ...any) {
	l.entry.Errorf(format, args...)
}

// Fatal creates a log at the ERROR level, then calls os.Exit.
func (l *Logger) Fatal(args ...any) {
	l.entry.Fatal(args...)
}

// Fatalf creates a formatted log at the ERROR level, then calls os.Exit.
func (l *Logger) Fatalf(format string, args ...any) {
	l.entry.Fatalf(format, args...)
}
