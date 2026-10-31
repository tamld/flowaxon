#!/usr/bin/env bash
# Mechanical Subresource Integrity (SRI) & CSP Inline-Style Verifier
set -euo pipefail

CSS_FILE="assets/css/flowaxon.css"
JS_FILE="assets/js/flowaxon.js"

CSS_HASH="sha384-$(openssl dgst -sha384 -binary "$CSS_FILE" | openssl base64 -A)"
JS_HASH="sha384-$(openssl dgst -sha384 -binary "$JS_FILE" | openssl base64 -A)"

echo "==> [SRI Gate] Expected CSS SHA-384: $CSS_HASH"
echo "==> [SRI Gate] Expected JS  SHA-384: $JS_HASH"

for html in index.html sites/g8s.html sites/aegis.html; do
  if ! grep -Fq "$CSS_HASH" "$html"; then
    echo "❌ FAIL: $html does not contain matching CSS SRI hash ($CSS_HASH)"
    exit 1
  fi
  if ! grep -Fq "$JS_HASH" "$html"; then
    echo "❌ FAIL: $html does not contain matching JS SRI hash ($JS_HASH)"
    exit 1
  fi
  if grep -Eq ' style="' "$html"; then
    echo "❌ FAIL: $html contains inline style=\"...\" violating CSP style-src 'self'"
    exit 1
  fi
done

echo "✅ PASS: All 3 HTML portals match exact SHA-384 SRI hashes and contain zero inline styles."
