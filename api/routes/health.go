package routes

import "net/http"

func GetHealth(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
