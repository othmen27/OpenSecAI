package main

import (
	"log"
	"net/http"
)

// OpenSecAI File Service — Phase 1 skeleton.
// Uploads, PDF report generation land in Phase 5.
func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"file-service","version":"0.1.0-skeleton"}`))
	})

	log.Println("file-service listening on :8083")
	if err := http.ListenAndServe(":8083", nil); err != nil {
		log.Fatal(err)
	}
}