package main

import (
	"log"
	"net/http"
)

// OpenSecAI Recon Service — Phase 1 skeleton.
// Subfinder/amass ingestion, Nuclei runner, CVE enrichment land in Phase 6.
func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"recon-service","version":"0.1.0-skeleton"}`))
	})

	log.Println("recon-service listening on :8084")
	if err := http.ListenAndServe(":8084", nil); err != nil {
		log.Fatal(err)
	}
}