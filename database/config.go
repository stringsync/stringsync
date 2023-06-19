package database

// Config contains configuration
type Config struct {
	Driver   string
	Host     string
	Port     int
	DBName   string
	User     string
	Password string
}
