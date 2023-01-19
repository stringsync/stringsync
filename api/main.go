package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"stringsync/api/routes"
	"stringsync/api/util"
)

func main() {
	var port = flag.Int("port", 8080, "the port to run the server")
	var allowedOrigins util.FlagSlice
	flag.Var(&allowedOrigins, "allowed_cors_origin", "allowed CORS origins")
	flag.Parse()

	mux := http.NewServeMux()

	routes.Install(mux, routes.RoutesConfig{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodHead,
		},
	})

	addr := fmt.Sprintf(":%d", *port)
	fmt.Printf("Server running at: http://localhost%v\n", addr)
	err := http.ListenAndServe(addr, mux)
	if err != nil {
		log.Fatal("http.ListenAndServe: ", err)
	}
}
