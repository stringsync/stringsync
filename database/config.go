package database

import "stringsync/util"

// Config contains configuration
type Config struct {
	Driver   string
	Host     string
	Port     int
	DBName   string
	User     string
	Password string
}

// / ConfigFromEnv creates a Config struct from the environment variables.
func ConfigFromEnv() Config {
	driver := util.GetEnvString("DB_DRIVER")
	if driver == "" {
		driver = "postgres"
	}

	host := util.MustGetEnvString("DB_HOST")
	port := util.MustGetEnvInt("DB_PORT")
	dbName := util.MustGetEnvString("DB_NAME")
	user := util.MustGetEnvString("DB_USERNAME")
	password := util.MustGetEnvString("DB_PASSWORD")

	return Config{
		Driver:   driver,
		Host:     host,
		Port:     port,
		DBName:   dbName,
		User:     user,
		Password: password,
	}
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
