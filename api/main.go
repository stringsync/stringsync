package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/stringsync/api/handler"
)

var port = flag.Int("port", 8080, "the port to run the server")

func main() {
	addr := fmt.Sprintf(":%d", *port)

	handler.Setup()

	fmt.Printf("listening at %v\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
