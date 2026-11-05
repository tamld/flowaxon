#!/usr/bin/env python3
"""C15 standing gate — hardened header parity across all 3 serving surfaces.

  _headers    (Cloudflare Pages edge headers)
  nginx.conf  (self-hosted container edge)
  main.go     (standalone Go mux headers)

Collision C15 (plans/261104-g8s-product-site/collision-matrix.md): a single-header
edit (frame-ancestors) silently dropped X-Content-Type-Options from main.go and
only the Stage 5 DAST caught it — three layers late. This gate asserts the FULL
hardened set on EVERY surface at Stage 3, before an image is ever built.

Exit 0 = parity; exit 1 = drift report.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# The required hardened set: header → exact expected value (normalized whitespace,
# compared case-insensitively on the name, value compared after collapsing spaces).
REQUIRED = {
    "content-security-policy": None,  # value compared across surfaces (must be IDENTICAL everywhere)
    "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
    "x-content-type-options": "nosniff",
    "x-frame-options": "SAMEORIGIN",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
}

def norm(value: str) -> str:
    value = value.strip().strip('"').strip("'")
    return re.sub(r"\s+", " ", value).rstrip(";").lower()

def parse_underscore_headers() -> dict:
    out = {}
    for line in (ROOT / "_headers").read_text().splitlines():
        if ":" in line and not line.startswith("/"):
            name, _, value = line.partition(":")
            key = name.strip().lower()
            if key in REQUIRED or key == "content-security-policy":
                out[key] = norm(value)
    return out

def parse_nginx() -> dict:
    out = {}
    text = (ROOT / "nginx.conf").read_text()
    # quoted form first (values like CSP contain semicolons), then bare form
    for m in re.finditer(r'add_header\s+([\w-]+)\s+"([^"]*)"[^;]*;', text):
        key = m.group(1).lower()
        if key in REQUIRED or key == "content-security-policy":
            out[key] = norm(m.group(2))
    for m in re.finditer(r'add_header\s+([\w-]+)\s+([^"\s][^;]*);', text):
        key = m.group(1).lower()
        if (key in REQUIRED or key == "content-security-policy") and key not in out:
            out[key] = norm(m.group(2))
    return out

def parse_main_go() -> dict:
    out = {}
    for m in re.finditer(r'w\.Header\(\)\.Set\("([\w-]+)",\s*"([^"]*)"\)', (ROOT / "main.go").read_text()):
        key = m.group(1).lower()
        if key in REQUIRED or key == "content-security-policy":
            out[key] = norm(m.group(2))
    return out

def main() -> int:
    surfaces = {
        "_headers": parse_underscore_headers(),
        "nginx.conf": parse_nginx(),
        "main.go": parse_main_go(),
    }
    failures = []
    for header in REQUIRED:
        values = {name: surfaces[name].get(header) for name in surfaces}
        missing = [name for name, v in values.items() if v is None]
        if missing:
            failures.append(f"{header}: MISSING on {', '.join(missing)}")
            continue
        distinct = set(values.values())
        if len(distinct) > 1:
            failures.append(f"{header}: VALUE DRIFT " + " | ".join(f"{n}={values[n][:60]}" for n in values))
            continue
        expected = REQUIRED[header]
        actual = next(iter(distinct))
        if expected is not None and actual != norm(expected):
            failures.append(f"{header}: expected '{expected}' got '{actual[:80]}'")
    # CSP frame policy assertion (the C13/C15 lesson: frame-ancestors must be 'self')
    csp_values = {n: surfaces[n].get("content-security-policy", "") for n in surfaces}
    for n, v in csp_values.items():
        if "frame-ancestors 'self'" not in v:
            failures.append(f"content-security-policy on {n}: frame-ancestors 'self' not declared")

    if failures:
        print("HEADER-PARITY: FAIL")
        for f in failures:
            print(f"  ✗ {f}")
        return 1
    print(f"HEADER-PARITY: PASS — {len(REQUIRED)} hardened headers identical across _headers, nginx.conf, main.go")
    return 0

if __name__ == "__main__":
    sys.exit(main())
