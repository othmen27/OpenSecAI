package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"google.golang.org/genai"
)

type GenerateRequest struct {
	Prompt string `json:"prompt"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	geminiAPIKey := os.Getenv("GEMINI_KEY")

	if geminiAPIKey == "" {
		log.Fatal("GEMINI_KEY is not set in the environment variables")
	}

	ctx := context.Background()

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  geminiAPIKey,
		Backend: genai.BackendGeminiAPI,
	})

	if err != nil {
		log.Fatalf("Failed to create Gemini client: %v", err)
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		w.Write([]byte(`{
			"status": "ok",
			"service": "ai-service",
			"version": "0.1.0-skeleton"
		}`))
	})

	http.HandleFunc("/response", func(w http.ResponseWriter, r *http.Request) {
		var req GenerateRequest

		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		if req.Prompt == "" {
			http.Error(w, "Prompt is required", http.StatusBadRequest)
			return
		}

		// Use a standalone context (not r.Context()) so a client timeout or
		// disconnect doesn't cancel the in-flight Gemini generation.
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		response, err := client.Models.GenerateContent(
			ctx,
			"gemini-3.6-flash",
			genai.Text(req.Prompt),
			nil,
		)

		if err != nil {
			log.Printf("Gemini error: %v", err)
			http.Error(w, "Failed to generate response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(map[string]string{
			"response": response.Text(),
		})
	})

	log.Println("ai-service listening on :8081")

	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}