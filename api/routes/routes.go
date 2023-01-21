package routes

import (
	"stringsync/api/router"
)

// Apply registers all the routes for stringsync.
func Apply(router *router.Router) {
	router.Get("/health", GetHealth())
}
