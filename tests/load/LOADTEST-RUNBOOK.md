# FlowAxon v4 — Load Test Runbook (k6)

Scope: baseline smoke against the production public site, and zero-origin
resilience proof against the Cloudflare Pages edge. Architecture context:
Cloudflare = ingress + compute; R2 = media; homelab = server home, **not**
the public-site origin — see `docs/research/01-brand-brief.md` §15.

---

## 1. Prerequisites

- k6 installed: `brew install k6` (or the official binary).
- For Cloud Runs: `k6 cloud login` (k6 Cloud account required).
- Tests live in `tests/load/`.

## 2. Run modes

### Local run

```bash
k6 run tests/load/k6-smoke.js
```

### k6 Cloud run (distributed load)

```bash
k6 cloud run tests/load/k6-smoke.js
```

Cloud runs add distributed load from multiple regions; use for the
formal baseline record. Local runs are fine for quick iteration.

### Overriding the target

Both scripts accept env overrides:

```bash
k6 run -e TARGET=https://<preview-host> -e ASSET_PATH=/assets/css/site.css tests/load/k6-edge-resilience.js
```

- `TARGET` — base URL under test. Default: the production public site.
- `ASSET_PATH` — one static asset fetched per iteration alongside the homepage.

## 3. Zero-origin resilience procedure (`k6-edge-resilience.js`)

Goal: prove the public site stays 200 while the homelab origin is fully
paused — the CF edge serves everything from cache/pages compute alone.

Step-by-step:

1. Confirm the Pages production deployment is healthy first:
   run `k6-smoke.js` against the production target and confirm the
   pass criteria in §4. Do not pause the origin while in a degraded state.
2. Before pausing, record the current state in the run log (timestamp,
   git SHA of the deployed Pages production version).
3. **Pause the origin on the fleet**: stop the public-site runtime on the
   homelab fleet (the single-binary static server). Follow the fleet's
   standard service-control procedure — this test runs only while the
   service is confirmed STOPPED.
4. Run the resilience suite against the Pages edge:

   ```bash
   k6 run -e TARGET=https://<pages-host> tests/load/k6-edge-resilience.js
   ```

5. While it runs, spot-check the target from a separate terminal:

   ```bash
   curl -sS -o /dev/null -w '%{http_code}\n' https://<pages-host>/
   ```

   Expect `200` on every request for the full 60s window.
6. **Resume the origin** on the fleet and verify its health endpoint
   returns to normal before finishing.
7. Confirm via the origin-side logs that the paused window saw zero
   production-site traffic (both requests must have been served by CF).

## 4. Pass criteria

| Criterion | Threshold | Applies to |
| --- | --- | --- |
| Latency p95 | `< 800` ms | `http_req_duration` (both suites) |
| Error rate | `< 1%` | `http_req_failed` (both suites) |
| HTTP status during zero-origin window | all `200` | homepage + asset checks (`k6-edge-resilience.js`) |
| Cache verification | no `BYPASS` on homepage | `k6-edge-resilience.js` homepage check |
| Load profile | 25 VUs sustained for 60 s | both suites |
| Zero-origin isolation | origin logs show no production-site traffic during the paused window | homelab-side verification |

A run is a PASS only if all edge-checks report green **and** the origin
log check confirms zero traffic during the paused window.

## 5. Recording results

- Attach the k6 summary output and the pass/fail verdict to the PR
  description (paste the end-of-run summary block as a fenced code block).
- Reference the `testRunId` tag value: `fxv4-baseline` for the smoke
  suite, `fxv4-edge-resilience` for the zero-origin suite.
- For Cloud runs, link the k6 Cloud run URL in the same PR comment.
- Any FAILED or rate-limited observations must include the failing
  request names from the k6 output so they are actionable.

## Results log

### 2026-11-01 — first edge load test (flowaxon-v4.pages.dev)
- k6 v2.3.0, 25 VUs / 60s, `k6-smoke.js`
- **PASS all thresholds**: p95 = **124ms** (budget <800ms, 6.4× headroom) · http_req_failed = **0.00%** · 19,548/19,548 checks succeeded · avg 76ms / med 66ms (VN → CF edge)
- Bottleneck note: p95 spike 1.01s max on first-run asset cold path; steady-state edge cache clean.
