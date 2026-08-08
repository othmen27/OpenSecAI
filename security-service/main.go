package main

import (
	"log"
	"net/http"
)

// OpenSecAI Security Service — Phase 1 skeleton.
// JWT/Cookie/HTTP/JS analyzers land in Phase 4.
func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"security-service","version":"0.1.0-skeleton"}`))
	})

	log.Println("security-service listening on :8082")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		log.Fatal(err)
	}
}