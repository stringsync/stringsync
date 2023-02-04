package router

import "strconv"

type Params struct {
	m map[string]string
}

// NewParams creates a new Params struct with an empty map.
func NewParams() *Params {
	return &Params{make(map[string]string)}
}

// String returns the parameter value as-is.
func (p Params) String(key string) (string, bool) {
	val, ok := p.m[key]
	return val, ok
}

// Bool coerces a string parameter value to a boolean.
func (p Params) Bool(key string) (bool, bool) {
	val, ok := p.m[key]
	b, err := strconv.ParseBool(val)
	return b, ok && err == nil
}

// Int coerces a string parameter value to an integer.
func (p Params) Int(key string) (int, bool) {
	val, ok := p.m[key]
	i, err := strconv.Atoi(val)
	return i, ok && err == nil
}

// Float64 coerces a string parameter value to a 64-bit float.
func (p Params) Float64(key string) (float64, bool) {
	val, ok := p.m[key]
	f, err := strconv.ParseFloat(val, 64)
	return f, ok && err == nil
}
