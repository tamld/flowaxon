#!/usr/bin/env bash
# Mechanical Subresource Integrity (SRI) & CSP Inline-Style Verifier
set -euo pipefail

CSS_FILE="assets/v5/v5.css"
JS_FILE="assets/v5/site.js"
RIG_FILE="assets/v5/herofield.js"

CSS_HASH="sha384-$(openssl dgst -sha384 -binary "$CSS_FILE" | openssl base64 -A)"
JS_HASH="sha384-$(openssl dgst -sha384 -binary "$JS_FILE" | openssl base64 -A)"
RIG_HASH="sha384-$(openssl dgst -sha384 -binary "$RIG_FILE" | openssl base64 -A)"

echo "==> [SRI Gate] Expected CSS SHA-384: $CSS_HASH"
echo "==> [SRI Gate] Expected JS  SHA-384: $JS_HASH"
echo "==> [SRI Gate] Expected FIELD SHA-384: $RIG_HASH"

for html in index.html sites/g8s.html sites/aegis.html; do
  if [ "$html" = "index.html" ]; then
    C_HASH="$CSS_HASH"; J_HASH="$JS_HASH"; X_HASH="$RIG_HASH"
  else
    C_HASH="sha384-$(openssl dgst -sha384 -binary assets/css/flowaxon.css | openssl base64 -A)"
    J_HASH="sha384-$(openssl dgst -sha384 -binary assets/js/flowaxon.js | openssl base64 -A)"
    X_HASH="$J_HASH"
  fi
  if ! grep -Fq "$C_HASH" "$html"; then
    echo "❌ FAIL: $html does not contain matching CSS SRI hash ($C_HASH)"
    exit 1
  fi
  if ! grep -Fq "$J_HASH" "$html"; then
    echo "❌ FAIL: $html does not contain matching JS SRI hash ($J_HASH)"
    exit 1
  fi
  if ! grep -Fq "$X_HASH" "$html"; then
    echo "❌ FAIL: $html does not contain matching FIELD/JS SRI hash ($X_HASH)"
    exit 1
  fi
  if grep -Eq ' style="' "$html"; then
    echo "❌ FAIL: $html contains inline style=\"...\" violating CSP style-src 'self'"
    exit 1
  fi
done

echo "✅ PASS: All 3 HTML portals match exact SHA-384 SRI hashes and contain zero inline styles."
