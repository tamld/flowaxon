#!/usr/bin/env bash
# Live DAST (Dynamic Application Security Testing) & Active Probe Runner (g8s-sec-gate)
set -euo pipefail

TARGET_URL="${1:-http://127.0.0.1:8080}"
echo "==> [DAST] Running Active Security Probes against $TARGET_URL..."

# 1. Healthz & Security Headers Probe
HEADERS=$(curl -sI "$TARGET_URL/")
for hdr in "content-security-policy:" "strict-transport-security:" "x-content-type-options: nosniff" "x-frame-options: DENY" "referrer-policy:" "permissions-policy:"; do
  if ! echo "$HEADERS" | grep -iq "$hdr"; then
    echo "❌ DAST FAIL: Missing required hardened header '$hdr'"
    exit 1
  fi
done
echo "    [PASS] Hardened HTTP Security Headers verified."

# 2. MIME-Sniffing Strictness Probe across Virtual Hosts & Assets
check_mime() {
  local host="$1"
  local path="$2"
  local expected="$3"
  local actual
  actual=$(curl -sI -H "Host: $host" "$TARGET_URL$path" | grep -i "^content-type:" | tr -d '\r')
  if ! echo "$actual" | grep -iq "$expected"; then
    echo "❌ DAST FAIL: Host=$host Path=$path returned '$actual', expected '$expected'"
    exit 1
  fi
}
check_mime "flowaxon.com" "/" "text/html"
check_mime "g8s.flowaxon.com" "/" "text/html"
check_mime "aegis.flowaxon.com" "/" "text/html"
check_mime "flowaxon.com" "/assets/css/flowaxon.css" "text/css"
check_mime "flowaxon.com" "/assets/js/flowaxon.js" "application/javascript"
check_mime "g8s.flowaxon.com" "/assets/diagrams/g8s-containment-anatomy.svg" "image/svg+xml"
check_mime "flowaxon.com" "/api/v1/products" "application/json"
echo "    [PASS] Strict MIME-Type isolation verified across all 3 virtual hosts."

# 3. Path Traversal & Source Exposure Probe
for payload in "/../../etc/passwd" "/..%2f..%2fetc/passwd" "/%2e%2e/%2e%2e/main.go"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --path-as-is "$TARGET_URL$payload")
  if [ "$code" = "200" ]; then
    body=$(curl -s --path-as-is "$TARGET_URL$payload")
    if echo "$body" | grep -Eq "root:x:|package main"; then
      echo "❌ DAST FAIL: Path traversal payload '$payload' leaked sensitive content!"
      exit 1
    fi
  fi
done
echo "    [PASS] Path traversal containment verified."

# 4. API Input Fuzzing, XSS Injection & Method Enforcement Probe
method_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$TARGET_URL/api/v1/g8s/verify-receipt")
if [ "$method_code" != "405" ]; then
  echo "❌ DAST FAIL: GET /api/v1/g8s/verify-receipt returned $method_code instead of 405 Method Not Allowed"
  exit 1
fi

xss_resp=$(curl -s -X POST "$TARGET_URL/api/v1/aegis/analyze" \
  -H "Content-Type: application/json" \
  -d '{"command":"<script>alert(1)</script> && rm -rf /"}')
if ! echo "$xss_resp" | grep -Fq "CRITICAL_HITL_BLOCK"; then
  echo "❌ DAST FAIL: Aegis AST analyzer failed to flag destructive payload"
  exit 1
fi
if ! curl -sD - -o /dev/null -X POST "$TARGET_URL/api/v1/aegis/analyze" -H "Content-Type: application/json" -d '{"command":"ls"}' | grep -iq "^content-type: application/json"; then
  echo "❌ DAST FAIL: API response is not strictly application/json (XSS risk)"
  exit 1
fi
echo "    [PASS] API Method Enforcement, AST Interception & JSON XSS neutralization verified."

echo "✅ ALL DAST ACTIVE SECURITY PROBES PASSED."
