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

// WithDBName returns a new Config with the DBName replaced.
func (c Config) WithDBName(dbName string) Config {
	return Config{
		Driver:   c.Driver,
		Host:     c.Host,
		Port:     c.Port,
		DBName:   dbName,
		User:     c.User,
		Password: c.Password,
	}
}

// WithDBName returns a new Config with an empty DBName.
func (c Config) WithoutDBName() Config {
	return c.WithDBName("")
}
