package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthz(t *testing.T) {
	mux := NewMux(".")
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	var resp map[string]any
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["status"] != "ok" {
		t.Errorf("status not ok: %v", resp)
	}
}

func TestMTASTS(t *testing.T) {
	mux := NewMux(".")
	req := httptest.NewRequest(http.MethodGet, "/.well-known/mta-sts.txt", nil)
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	if w.Header().Get("Content-Type") != "text/plain; charset=utf-8" {
		t.Errorf("wrong content-type: %s", w.Header().Get("Content-Type"))
	}
}

func TestSecurityTxt(t *testing.T) {
	mux := NewMux(".")
	req := httptest.NewRequest(http.MethodGet, "/.well-known/security.txt", nil)
	req.Host = "flowaxon.com"
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	body := w.Body.String()
	if !strings.Contains(body, "Canonical: https://flowaxon.com/.well-known/security.txt") {
		t.Errorf("missing canonical: %s", body)
	}
}

func TestProducts(t *testing.T) {
	mux := NewMux(".")
	req := httptest.NewRequest(http.MethodGet, "/api/v1/products", nil)
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	var resp map[string]any
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["verified_live_at"] == nil {
		t.Error("missing verified_live_at")
	}
}

func TestTelemetryStreamOnce(t *testing.T) {
	mux := NewMux(".")
	req := httptest.NewRequest(http.MethodGet, "/api/v1/telemetry/stream?once=1", nil)
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	if !strings.Contains(w.Body.String(), "event: pulse") {
		t.Errorf("missing event: pulse: %s", w.Body.String())
	}
}

func TestG8sVerifyReceipt(t *testing.T) {
	mux := NewMux(".")
	tests := []struct {
		name       string
		body       string
		wantAllowed bool
		wantCode   string
	}{
		{"S1 blocked", `{"tier":"T1","stratum":"S1","target_path":"internal/worker/x"}`, false, "E_S1_DIRECT_MUTATION_FORBIDDEN"},
		{"S3-M allowed", `{"tier":"T1","stratum":"S3-M","target_path":"internal/worker/x"}`, true, "RECEIPT_VERIFIED_OK"},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/v1/g8s/verify-receipt", bytes.NewBufferString(tc.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			mux.ServeHTTP(w, req)
			if w.Code != http.StatusOK {
				t.Fatalf("expected 200, got %d", w.Code)
			}
			var resp map[string]any
			json.Unmarshal(w.Body.Bytes(), &resp)
			if resp["allowed"] != tc.wantAllowed {
				t.Errorf("allowed=%v want=%v", resp["allowed"], tc.wantAllowed)
			}
			if resp["code"] != tc.wantCode {
				t.Errorf("code=%v want=%v", resp["code"], tc.wantCode)
			}
		})
	}
}

func TestAegisAnalyze(t *testing.T) {
	mux := NewMux(".")
	tests := []struct {
		name      string
		cmd       string
		wantRisk  string
	}{
		{"kubectl delete blocked", "kubectl delete pod x", "CRITICAL_HITL_BLOCK"},
		{"git status safe", "git status", "SAFE_AUTO_APPROVE"},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			body := `{"command":` + jsonEscape(tc.cmd) + `}`
			req := httptest.NewRequest(http.MethodPost, "/api/v1/aegis/analyze", bytes.NewBufferString(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			mux.ServeHTTP(w, req)
			if w.Code != http.StatusOK {
				t.Fatalf("expected 200, got %d", w.Code)
			}
			var resp map[string]any
			json.Unmarshal(w.Body.Bytes(), &resp)
			if resp["risk_level"] != tc.wantRisk {
				t.Errorf("risk_level=%v want=%v", resp["risk_level"], tc.wantRisk)
			}
		})
	}
}

func jsonEscape(s string) string {
	b, _ := json.Marshal(s)
	return string(b)
}

func TestHTMLAndStaticAssetMIMETypes(t *testing.T) {
	mux := NewMux(".")
	cases := []struct {
		host     string
		path     string
		wantMime string
	}{
		{"flowaxon.com", "/", "text/html"},
		{"g8s.flowaxon.com", "/", "text/html"},
		{"aegis.flowaxon.com", "/", "text/html"},
		{"flowaxon.com", "/assets/css/flowaxon.css", "text/css"},
		{"flowaxon.com", "/assets/js/flowaxon.js", "application/javascript"},
		{"g8s.flowaxon.com", "/assets/diagrams/g8s-containment-anatomy.svg", "image/svg+xml"},
		{"aegis.flowaxon.com", "/assets/diagrams/aegis-defense-layers.svg", "image/svg+xml"},
	}
	for _, tc := range cases {
		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		req.Host = tc.host
		w := httptest.NewRecorder()
		mux.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("%s%s: expected 200, got %d", tc.host, tc.path, w.Code)
		}
		ct := w.Header().Get("Content-Type")
		if !strings.HasPrefix(ct, tc.wantMime) {
			t.Errorf("%s%s: got Content-Type %q, want prefix %q", tc.host, tc.path, ct, tc.wantMime)
		}
	}
}
