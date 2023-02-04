package router

import (
	"testing"
)

func TestString(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  Params
		key     string
		wantVal string
		wantOk  bool
	}{
		{
			name:    "key present in map",
			params:  Params{map[string]string{"foo": "bar"}},
			key:     "foo",
			wantVal: "bar",
			wantOk:  true,
		}, {
			name:    "key absent from map",
			params:  Params{},
			key:     "foo",
			wantVal: "",
			wantOk:  false,
		},
	} {
		gotVal, gotOk := test.params.String(test.key)
		if gotVal != test.wantVal || gotOk != test.wantOk {
			t.Errorf("String(%q) = %q, %v, want %q, %v",
				test.key, gotVal, gotOk, test.wantVal, test.wantOk)
		}
	}
}

func TestBool(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  Params
		key     string
		wantVal bool
		wantOk  bool
	}{
		{
			name:    "key present in map",
			params:  Params{map[string]string{"foo": "true"}},
			key:     "foo",
			wantVal: true,
			wantOk:  true,
		}, {
			name:    "key absent from map",
			params:  Params{},
			key:     "foo",
			wantVal: false,
			wantOk:  false,
		}, {
			name:    "invalid truthy value",
			params:  Params{map[string]string{"foo": "tru"}},
			key:     "foo",
			wantVal: false,
			wantOk:  false,
		}, {
			name:    "invalid falsey value",
			params:  Params{map[string]string{"foo": "nah"}},
			key:     "foo",
			wantVal: false,
			wantOk:  false,
		},
	} {
		gotVal, gotOk := test.params.Bool(test.key)
		if gotVal != test.wantVal || gotOk != test.wantOk {
			t.Errorf("String(%q) = %v, %v, want %v, %v",
				test.key, gotVal, gotOk, test.wantVal, test.wantOk)
		}
	}
}

func TestInt(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  Params
		key     string
		wantVal int
		wantOk  bool
	}{
		{
			name:    "key present in map",
			params:  Params{map[string]string{"foo": "42"}},
			key:     "foo",
			wantVal: 42,
			wantOk:  true,
		}, {
			name:    "key absent from map",
			params:  Params{},
			key:     "foo",
			wantVal: 0,
			wantOk:  false,
		}, {
			name:    "invalid value",
			params:  Params{map[string]string{"foo": "42.2"}},
			key:     "foo",
			wantVal: 0,
			wantOk:  false,
		},
	} {
		gotVal, gotOk := test.params.Int(test.key)
		if gotVal != test.wantVal || gotOk != test.wantOk {
			t.Errorf("String(%q) = %v, %v, want %v, %v",
				test.key, gotVal, gotOk, test.wantVal, test.wantOk)
		}
	}
}

func TestFloat64(t *testing.T) {
	for _, test := range []struct {
		name    string
		params  Params
		key     string
		wantVal float64
		wantOk  bool
	}{
		{
			name:    "key present in map",
			params:  Params{map[string]string{"foo": "42"}},
			key:     "foo",
			wantVal: 42,
			wantOk:  true,
		}, {
			name:    "key absent from map",
			params:  Params{},
			key:     "foo",
			wantVal: 0,
			wantOk:  false,
		}, {
			name:    "invalid value",
			params:  Params{map[string]string{"foo": "42.2.2"}},
			key:     "foo",
			wantVal: 0,
			wantOk:  false,
		},
	} {
		gotVal, gotOk := test.params.Float64(test.key)
		if gotVal != test.wantVal || gotOk != test.wantOk {
			t.Errorf("String(%q) = %v, %v, want %v, %v",
				test.key, gotVal, gotOk, test.wantVal, test.wantOk)
		}
	}
}
