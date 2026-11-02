# F1-A — Rig v2: concretize the OPERATING process (not just the idea)

Role: implementer. Research → implement → eval → loop until PASS → report. Do NOT git commit; leave changes in your worktree.

## Mission
`index.html` ACT II + `assets/v5/site.js` + `assets/v5/v5.css` contain a half-built "dispatch story" rig (planes, packet, chips, gate ring, anatomy, drag). Two gaps:
1. The packet position uses hardcoded `%` waypoints that do NOT match the projected plane positions — replace with anchor-derived positioning.
2. The story describes containment abstractly. The operator requires it to **simulate the real operating process** with REAL artifacts from an actual harness run (below).

## Ground truth — real captured dispatch (cite these exact values, never invent)
task 6a605f76-8a88-4b7f-a457-df194c6775e6 · provider agy · model gemini-3.8-flash-low · role scout · read_only
event stream: task_submitted → task_claimed (lease_seconds 60, lease_token b9f379a2…) → task_started → attempt_finished (result_hash 99bcdd7e2891…, duration 5.86s, state WORKER_COMPLETED)
response: {"ok":true,"harness":"g8s"} · receipt sealed: 96fd2088fe80da90

## Requirements
R1. DOM order flip: planes must render p1=F2 (bottom-left), p2=F1 (middle), p3=F0 (top-right) in the staircase. Currently F0 is leftmost.
R2. Packet anchoring: a function `anchorToPlane(layer)` computes the packet's left/top from the plane's `getBoundingClientRect()` relative to `.rig3` (percentages). Call it on every step change, on `resize`, and on drag `pointerup` (rotation changes projection). Delete hardcoded WP constants.
R3. Packet carries the task label `6a605f76` (tiny mono text near/inside the packet).
R4. Operational states replace abstract ones — chip labels use the REAL event names, note uses REAL values:
   step1 F0: "task_submitted" chip → note mentions brief issued
   step2 F1: "task_claimed · lease 60s" chip + a visible 60→0 countdown ticking during the F1 dwell (~3s), note cites CAS lease
   step3 F2: "task_started" chip + seals pop, note mentions sandbox F1 + response {"ok":true,"harness":"g8s"}
   step4 F1: receipt seal stamp — chip "receipt sealed · 96fd2088"
   step5 F0: gate ring on — "attempt_finished · 5.86s"
   step6: "WORKER_COMPLETED ✓ — 1 issue = 1 worker = 1 receipt"
R5. Preserve: click plane → descend + anatomy panel (content already in site.js ANATOMY), drag rotate, click packet → freeze/resume, ESC pull-back, prefers-reduced-motion static mode, mobile 480px tier.
R6. CSP-clean: zero inline `style=` attributes in index.html, zero inline scripts. All styles in v5.css, logic in site.js.
R7. After ANY edit to v5.css / site.js / herofield.js you MUST rehash SRI and update index.html integrity attrs:
   `for f in assets/v5/v5.css assets/v5/site.js; do openssl dgst -sha384 -binary $f | openssl base64 -A; done`
   then patch the two integrity="sha384-…" values in index.html. `bash scripts/verify-sri.sh` must PASS.

## Acceptance criteria (run all, include output in report)
- A1 `bash scripts/verify-sri.sh` → "✅ PASS"
- A2 `grep -c ' style="' index.html` → 0
- A3 `node --check assets/v5/site.js` → exit 0
- A4 `grep -n 'data-layer' index.html` shows order F2, F1, F0
- A5 `grep -c 'anchorToPlane\|getBoundingClientRect' assets/v5/site.js` ≥ 1 and no `WP = {` hardcoded waypoints remain
- A6 `git diff --stat` lists ONLY: index.html, assets/v5/site.js, assets/v5/v5.css

## Report format (final message)
RESEARCH: what you read, what you kept/changed and why
CHANGES: per file, one line each
EVAL: table criterion → command → PASS/FAIL → output line
KNOWN ISSUES / SUGGESTIONS: honest list
