// Package main runs a stringsync server.
package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"stringsync/api/middleware"
	"stringsync/api/router"
	"stringsync/api/routes"
	"stringsync/api/util"
)

func main() {
	var port = flag.Int("port", 8080, "the port to run the server")
	var allowedOrigins util.FlagSlice
	flag.Var(&allowedOrigins, "allowed_cors_origin", "allowed CORS origins")
	flag.Parse()

	router := router.NewRouter()
	router.Middleware(
		middleware.Cors(allowedOrigins, []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		}))
	router.Middleware(middleware.Logger)
	routes.Apply(router)

	mux := http.NewServeMux()
	mux.Handle("/", router)

	addr := fmt.Sprintf(":%d", *port)
	fmt.Printf("Server running at: http://localhost%v\n", addr)
	err := http.ListenAndServe(addr, mux)
	if err != nil {
		log.Fatal("http.ListenAndServe: ", err)
	}
}
