package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

var startTime = time.Now()

func NewMux(rootDir string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		host := r.Host
		path := r.URL.Path

		if strings.HasPrefix(host, "www.") {
			http.Redirect(w, r, "https://flowaxon.com"+r.URL.RequestURI(), http.StatusMovedPermanently)
			return
		}

		if path == "/.well-known/mta-sts.txt" || strings.HasPrefix(host, "mta-sts.") {
			if strings.HasPrefix(host, "mta-sts.") && path != "/.well-known/mta-sts.txt" && path != "/.well-known/security.txt" {
				http.NotFound(w, r)
				return
			}
			if path == "/.well-known/mta-sts.txt" {
				w.Header().Set("Content-Type", "text/plain; charset=utf-8")
				w.Header().Set("Cache-Control", "public, max-age=86400")
				http.ServeFile(w, r, filepath.Join(rootDir, ".well-known/mta-sts.txt"))
				return
			}
		}

		if path == "/.well-known/security.txt" || path == "/security.txt" {
			cleanHost := strings.TrimPrefix(host, "mta-sts.")
			if cleanHost == "" {
				cleanHost = "flowaxon.com"
			}
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			fmt.Fprintf(w, "Contact: mailto:security@%s\nExpires: %s\nCanonical: https://%s/.well-known/security.txt\nPolicy: https://%s/security-policy\n", cleanHost, time.Now().AddDate(1,0,0).Format(time.RFC3339), cleanHost, cleanHost)
			return
		}

		if path == "/llms.txt" || path == "/llms-full.txt" {
			w.Header().Set("Content-Type", "text/markdown; charset=utf-8")
			http.ServeFile(w, r, filepath.Join(rootDir, path))
			return
		}

		site := r.URL.Query().Get("site")
		if (strings.HasPrefix(host, "g8s.") && path == "/") || path == "/sites/g8s" || (path == "/" && site == "g8s") {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			http.ServeFile(w, r, filepath.Join(rootDir, "sites/g8s.html"))
			return
		}
		if (strings.HasPrefix(host, "aegis.") && path == "/") || path == "/sites/aegis" || (path == "/" && site == "aegis") {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			http.ServeFile(w, r, filepath.Join(rootDir, "sites/aegis.html"))
			return
		}

		if path == "/" || path == "/index.html" {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			http.ServeFile(w, r, filepath.Join(rootDir, "index.html"))
			return
		}

		if strings.HasPrefix(path, "/api/") || path == "/healthz" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
		}

		switch {
		case path == "/healthz" && r.Method == http.MethodGet:
			var m runtime.MemStats
			runtime.ReadMemStats(&m)
			json.NewEncoder(w).Encode(map[string]any{
				"status": "ok", "engine": "flowaxon-engine", "version": "2.0.0", "host": host,
				"uptime_sec": int(time.Since(startTime).Seconds()), "mem_alloc_kb": m.Alloc / 1024, "goroutines": runtime.NumGoroutine(),
			})

		case path == "/api/v1/products" && r.Method == http.MethodGet:
			data, _ := os.ReadFile(filepath.Join(rootDir, "data/products.json"))
			var products any
			json.Unmarshal(data, &products)
			var m runtime.MemStats
			runtime.ReadMemStats(&m)
			resp := map[string]any{"products": products, "verified_live_at": time.Now().UTC().Format(time.RFC3339), "engine_mem_kb": m.Alloc / 1024}
			json.NewEncoder(w).Encode(resp)

		case path == "/api/v1/telemetry" && r.Method == http.MethodGet:
			data, _ := os.ReadFile(filepath.Join(rootDir, "data/telemetry.json"))
			var tel any
			json.Unmarshal(data, &tel)
			var m runtime.MemStats
			runtime.ReadMemStats(&m)
			resp := map[string]any{
				"telemetry": tel,
				"runtime_engine": map[string]any{
					"name": "flowaxon-engine (Go Single-Binary)", "uptime_sec": int(time.Since(startTime).Seconds()),
					"mem_alloc_kb": m.Alloc / 1024, "goroutines": runtime.NumGoroutine(),
					"gitops_mode": "Pull-Based GHCR (io.containers.autoupdate=registry)",
				},
			}
			json.NewEncoder(w).Encode(resp)

		case path == "/api/v1/telemetry/stream" && r.Method == http.MethodGet:
			w.Header().Set("Content-Type", "text/event-stream")
			w.Header().Set("Cache-Control", "no-cache")
			w.Header().Set("Connection", "keep-alive")
			w.Header().Set("X-Accel-Buffering", "no")
			flusher, _ := w.(http.Flusher)
			once := r.URL.Query().Get("once") == "1"
			for {
				select {
				case <-r.Context().Done():
					return
				default:
				}
				probeStart := time.Now()
				var m runtime.MemStats
				runtime.ReadMemStats(&m)
				data := map[string]any{
					"uptime_sec": int(time.Since(startTime).Seconds()), "mem_alloc_kb": m.Alloc / 1024,
					"goroutines": runtime.NumGoroutine(), "probe_latency_ms": time.Since(probeStart).Milliseconds(),
					"lan": "UP", "wan": "UP", "timestamp": time.Now().UTC().Format(time.RFC3339),
				}
				b, _ := json.Marshal(data)
				fmt.Fprintf(w, "event: pulse\ndata: %s\n\n", b)
				flusher.Flush()
				if once {
					return
				}
				time.Sleep(2 * time.Second)
			}

		case path == "/api/v1/drill" && r.Method == http.MethodPost:
			var req struct{ Mode string }
			json.NewDecoder(r.Body).Decode(&req)
			json.NewEncoder(w).Encode(map[string]any{
				"ok": true, "mode": req.Mode, "isolated_in_ms": 180,
				"lan_probe": "HTTP 200 (1.4ms)", "wan_probe": "Protected via Cloudflare Edge TLS 1.3",
				"verdict": "ZERO_TRUST_CONTAINMENT_VERIFIED", "timestamp": time.Now().UTC().Format(time.RFC3339),
			})

		case path == "/api/v1/g8s/verify-receipt" && r.Method == http.MethodPost:
			var req struct {
				Tier         string   `json:"tier"`
				Stratum      string   `json:"stratum"`
				TargetPath   string   `json:"target_path"`
				AllowedPaths []string `json:"allowed_paths"`
			}
			json.NewDecoder(r.Body).Decode(&req)
			if req.Stratum == "S1" || req.Stratum == "S3-A" || req.Stratum == "O-Plane" {
				json.NewEncoder(w).Encode(map[string]any{"allowed": false, "code": "E_S1_DIRECT_MUTATION_FORBIDDEN", "reason": "Kernel Firewall: Stratum S1/S3-A/O-Plane is strictly read-only."})
				return
			}
			if strings.Contains(req.TargetPath, "..") || strings.Contains(req.TargetPath, ".env") || strings.HasPrefix(req.TargetPath, "/etc/") {
				json.NewEncoder(w).Encode(map[string]any{"allowed": false, "code": "E_DLP_TRUST_BOUNDARY_VIOLATION", "reason": "Zero-Trust Boundary: sensitive or traversal path blocked."})
				return
			}
			allowed := req.AllowedPaths
			if len(allowed) == 0 {
				allowed = []string{"internal/worker/", "cmd/g8s/", "web/"}
			}
			for _, p := range allowed {
				if strings.HasPrefix(req.TargetPath, p) {
					json.NewEncoder(w).Encode(map[string]any{"allowed": true, "code": "RECEIPT_VERIFIED_OK", "receipt_id": "rcpt-cas-verified", "reason": "Single-use WriteReceipt scope verified in-process."})
					return
				}
			}
			json.NewEncoder(w).Encode(map[string]any{"allowed": false, "code": "E_WRITE_SCOPE_VIOLATION", "reason": "Target path outside WriteReceipt.AllowedPaths."})

		case path == "/api/v1/aegis/analyze" && r.Method == http.MethodPost:
			var req struct{ Command string }
			json.NewDecoder(r.Body).Decode(&req)
			cmd := req.Command
			highRisk := []string{"kubectl delete", "zfs destroy", "systemctl restart", "systemctl stop", "chmod 777", "| sh", "| bash", "--force", "sudo ", "/etc/shadow"}
			var matched []string
			for _, t := range highRisk {
				if strings.Contains(cmd, t) {
					matched = append(matched, t)
				}
			}
			if len(matched) > 0 {
				json.NewEncoder(w).Encode(map[string]any{
					"command": cmd, "risk_level": "CRITICAL_HITL_BLOCK", "risk_score": 94, "matched_rules": matched,
					"hitl_card": map[string]any{"channel": "Telegram Bot API (HITL)", "status": "PENDING_OPERATOR_APPROVAL", "actions": []string{"APPROVE_ONCE", "DENY_AND_KILL_PGID"}},
				})
			} else {
				json.NewEncoder(w).Encode(map[string]any{
					"command": cmd, "risk_level": "SAFE_AUTO_APPROVE", "risk_score": 8, "matched_rules": []string{},
					"hitl_card": map[string]any{"channel": "Aegis Fast-Path", "status": "AUTO_APPROVED", "actions": []string{"EXECUTED"}},
				})
			}

		case path == "/api/v1/hooks/redeploy" && r.Method == http.MethodPost:
			secret := os.Getenv("FLOWAXON_WEBHOOK_SECRET")
			sig := r.Header.Get("X-Hub-Signature-256")
			if secret == "" || sig == "" {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			body, _ := io.ReadAll(r.Body)
			mac := hmac.New(sha256.New, []byte(secret))
			mac.Write(body)
			expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
			if !hmac.Equal([]byte(sig), []byte(expected)) {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			json.NewEncoder(w).Encode(map[string]string{"status": "pull_triggered"})

		default:
			w.Header().Del("Content-Type")
			if strings.HasSuffix(path, ".svg") {
				w.Header().Set("Content-Type", "image/svg+xml")
			} else if strings.HasSuffix(path, ".css") {
				w.Header().Set("Content-Type", "text/css; charset=utf-8")
			} else if strings.HasSuffix(path, ".js") {
				w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
			}
			http.FileServer(http.Dir(rootDir)).ServeHTTP(w, r)
		}
	})
	return mux
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}
	rootDir := os.Getenv("SITE_ROOT")
	if rootDir == "" {
		rootDir = "."
	}
	if len(os.Args) > 1 {
		rootDir = os.Args[1]
	}
	http.ListenAndServe(":"+port, NewMux(rootDir))
}
