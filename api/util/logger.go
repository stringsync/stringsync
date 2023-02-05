package util

import (
	"io"

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

// SetGlobalField adds a field to the root logger.
func (l *Logger) SetGlobalField(key string, value any) {
	l.globalFieldHook.data[key] = value
}

// SetLocalField adds a field to the child logger.
func (l *Logger) SetLocalField(key string, value any) {
	l.entry = l.entry.WithField(key, value)
}

// Infof creates a log at the INFO level.
func (l *Logger) Infof(format string, args ...any) {
	l.entry.Infof(format, args...)
}

// Warnf creates a log at the WARN level.
func (l *Logger) Warnf(format string, args ...any) {
	l.entry.Warnf(format, args...)
}

// Errorf creates a lgo at the ERROR level.
func (l *Logger) Errorf(format string, args ...any) {
	l.entry.Errorf(format, args...)
}
