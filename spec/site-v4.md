# Site v4 — Shipped Feature Spec

**Spec ID**: `spec/site-v4` · **Status**: `shipped` (v4.0) · **Governance**: `g8s-spec-driven-development`
**Format**: openspec/speckit-style feature spec. Every Acceptance is a mechanical, CI-runnable
check (`grep`, `gzip -c | wc -c`, headless audit, k6 run) — exit-code semantics, no human
judgment. No invented metrics: cited values are campaign-measured (§7).

## 1. Purpose & scope

`site-v4` is the public launchpad surface of the FlowAxon constellation: a static, CSP-first
portfolio page (`sites/v4/`) served from edge compute with media offloaded to catalogued
`/assets/video/` slots — a homelab-free public surface. It presents the engineering thesis
(deterministic harnesses for autonomous AI agents) through g8s + Aegis proof, a
deployment-topology rig, and referenceable stats; it renders feature-map *references* on-page,
while each project's feature map renders on its own subdomain.

The SSoT files this spec indexes are:

| SSoT role | Path |
|---|---|
| Feature map, topology, palettes (`FM-*` IDs) | `manifest.json` (repo root) |
| Copy deck (voice, headline, body copy) | `docs/copy/copy-deck-v4.md` |
| Design direction / OKLCH tokens | `docs/research/10-design-direction-use-cases.md` |
| Campaign evidence map | `docs/research/15-treasure-map.md` |
| Writing outlines (essays referenced by SF-11) | `docs/essays/essays-v4-outlines.md` |
| Implementation artifacts (spec ground truth) | `sites/v4/{index.html,v4.css,v4.js,rig.js}` |
| Governing change ledger (this campaign) | trusted operator directive — outside the repo |

Shipped file inventory (roles):

- `sites/v4/index.html` — the single page: header nav, 9 sections (hero → footer), rig SVG, popover.
- `sites/v4/v4.css` — OKLCH design tokens + layout + motion + reduced-motion fallbacks.
- `sites/v4/v4.js` — count-up stats, scrubber, dispatch replay, clipboard copy, reveal-on-scroll.
- `sites/v4/rig.js` — WF4 rig extension: entity registry, click-popover, `/drill` palette, pulses wiring.

Acceptance notation used in §2–§4:

- `grep -q PATTERN  # 0 exit` — pattern must appear at least once (exit 0).
- `grep -c PATTERN  # = n` — pattern must appear exactly `n` times (regression-safe against drift).
- `grep -c PATTERN  # >= n` — pattern must appear at least `n` times.
- `gzip -c F | wc -c  # <= B` — asset wire budget in bytes.
- Audit/k6 gates — command exits nonzero on any violation; summaries recorded, thresholds never assumed.

## 2. Feature map (shipped site features)

One row per shipped site feature; the 12 map to the page section order (hero through footer).

| ID | Feature | Spec (1 line) | Acceptance (mechanical check) | Source files |
|---|---|---|---|---|
| SF-01 | Hero + referencable stats | `$ whoami` kicker, thesis h1, pillar chips, 4-card stat grid — every stat carries an independent source link (GitHub stars, CI run, `/healthz`, g8s repo). | `grep -c 'data-count="' index.html` ≥ 4; `grep -c 'runs/41189766268' index.html` ≥ 2; `grep -q 'href="/healthz"' index.html` 0 exit. | `index.html#hero`, `v4.js` |
| SF-02 | Trust-duality panels | g8s ("the engine agents obey": rings F2⊆F1⊆F0, receipts, fail-closed worktrees) vs Aegis ("the console humans command": runtime interception, HITL, AST guards), joined by a "Harness Ring" hinge. | `grep -q 'id="duality"' index.html` 0 exit; `grep -q 'panel-g8s'` 0 exit; `grep -q 'panel-aegis'` 0 exit. | `index.html#duality` |
| SF-03 | One-thread diagram | One dashed-amber SVG timeline with exactly 3 milestone nodes (2016 shell scripts → 2021 homelab doctrine → 2025 g8s harness) plus 3 matching caption boxes. | `grep -c 'r="8"' index.html` = 3; `grep -c 'thread-node-box'` = 3; `grep -q 'stroke-dasharray'` 0 exit. | `index.html#thread` |
| SF-04 | Act I · 48h scrubber | Input-range scrubber (0..48h, step 1) with 0/12/24/36/48h milestone buttons driving hour, squad, recovery-count, and operational-log readout in the Act I crucible card. | `grep -qE 'id="scrubber-range"[^>]*max="48" step="1"' index.html` 0 exit; `grep -c 'data-hour="'` = 5; `grep -q 'id="scrubber-log"'` 0 exit. | `index.html#acts`, `v4.js` |
| SF-05 | Act II · constellation rig (pre-WF4 SVG state) | Static SVG deployment map `EDGE→INGRESS→FLEET→ENGINE→HARNESS` with plate readout `RSS 864KB • TLS 1.3 mTLS • 6/6 CI GREEN`, provenance lines cite `manifest.json` + run #41189766268; WF4 (§4) extends this state, does not replace it. | `grep -c 'class="rig-node"' index.html` = 5; `grep -q 'RSS 864KB • TLS 1.3 mTLS • 6/6 CI GREEN'` 0 exit; `grep -c '41189766268' index.html` ≥ 3. | `index.html#acts` |
| SF-06 | Act III · dispatch worker demo | 5-step dispatch flow (F0 Brain → F1·a Lease → F1·b Scoped Write → F1·c WriteReceipt → Seal & Done) replayed into a terminal log by a trigger button, bridged to the rig (`data-drill="harness"`). | `grep -c 'class="term-line"' index.html` = 5; `grep -q 'id="btn-dispatch-trigger"' index.html` 0 exit. | `index.html#acts`, `v4.js` |
| SF-07 | Surf-map bars + clusters | 5-bar star histogram (2022..2026: 183/186/106/456/212) + 8 topic-cluster chips, footed with provenance `n=1,146`, fetched 2026-10-31, and a live GitHub source link. | `grep -c 'surf-bar bar-202' index.html` = 5; `grep -c 'cluster-chip"'` = 8; `grep -q 'n=1,146' index.html` 0 exit. | `index.html#surf` |
| SF-08 | Work proof rows | 3 proof rows — g8s (v0.21 · 21+ releases), Aegis (0 unreviewed mutations), constellation (6/6 stages green) — each linked to its live repository. | `grep -c 'class="work-row' index.html` = 3; `grep -q 'github.com/tamld/g8s'` 0 exit; `grep -q 'github.com/tamld/aegis'` 0 exit; `grep -q 'github.com/tamld/flowaxon'` 0 exit. | `index.html#work` |
| SF-09 | In-motion video slots | Lazy media slot: `<video>` with poster preview, `data-src` VP9 explainer (5.5 MB), `preload="none"`, muted/loop/playsinline — zero media bytes until activation; `/assets/video/` is edge/R2-catalogued, not homelab-served. | `grep -q 'data-src="/assets/video/g8s-explainer/g8s-explainer.webm"'` 0 exit; `grep -q 'preload="none"'` 0 exit; `grep -q 'poster="/assets/video/g8s-explainer/poster.jpg"'` 0 exit. | `index.html#motion` |
| SF-10 | Collaborate + whoami | Three engagement proposition cards ("chaos → system", "agents you can bet production on", "systems that prove themselves") plus the canonical whoami blockquote; copy sourced from the copy deck. | `grep -c 'class="prop-card' index.html` = 3; `grep -q 'whoami-block' index.html` 0 exit. | `index.html#collaborate`, `docs/copy/copy-deck-v4.md` |
| SF-11 | Writing outlines | "Essays & Systems Doctrine" list with exactly 3 titled essays, all declared `outline` status — maturity stated honestly, full development lives in the essays SSoT, not on-page. | `grep -c 'essay-name' index.html` = 3; `grep -c 'essay-status">outline' index.html` = 3. | `index.html`, `docs/essays/essays-v4-outlines.md` |
| SF-12 | Contact copy-button | Footer contact `hello@flowaxon.com` with one-click clipboard copy (`aria-label="Copy email to clipboard"`), plus `github.com/tamld` and live `/.well-known/security.txt` links. | `grep -q 'id="copy-email-btn"' index.html` 0 exit; `grep -q 'hello@flowaxon.com'` 0 exit; `grep -q '/.well-known/security.txt'` 0 exit. | `index.html#footer`, `v4.js` |

All acceptance paths are relative to `sites/v4/`.

## 3. Non-functional requirements

| ID | NFR | Spec (1 line) | Acceptance (mechanical check) |
|---|---|---|---|
| NFR-01 | CSP-first, zero inline | No inline `<script>`, inline `style="..."`, or inline event handlers; behavior/presentation ship only via `v4.css`/`v4.js`/`rig.js`; CSP is engine-enforced (`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; …`). | `grep -c '<script>' index.html` = 0; `grep -c 'style="' index.html` = 0; `grep -q 'Content-Security-Policy' main.go` 0 exit. |
| NFR-02 | Wire budgets (gzip) | Campaign-measured payloads inside budget: html gzip **7.5 KB** (≤ 8K), css gzip **5.1 KB** (≤ 6K), js gzip **6.7 KB total** (`v4.js` **2.9 KB** + `rig.js` **3.7 KB**, ≤ 4K per file); any single-asset regression fails the gate. | `gzip -c index.html \| wc -c` ≤ 8192; `gzip -c v4.css \| wc -c` ≤ 6144; `gzip -c v4.js \| wc -c` ≤ 4096; `gzip -c rig.js \| wc -c` ≤ 4096. |
| NFR-03 | Reduced motion | All animation paths (reveals, count-up, scrubber, rig pulses) honor `prefers-reduced-motion: reduce` — CSS `@media` fallbacks in both stylesheets and a JS `matchMedia('(prefers-reduced-motion: reduce)')` guard in both scripts. | `grep -c 'prefers-reduced-motion' v4.css` = 2; `grep -c 'prefers-reduced-motion' v4.js` ≥ 1; same check on `rig.js` ≥ 1. |
| NFR-04 | DLP scan clean | The 8-gate zero-leakage pre-commit suite (gradient law, schema validity, SVG byte budget, OpSec sanitization, secrets) runs on every PR touching the v4 tree; run #41189766268 Stage 1 green, DLP clean. | `bash .githooks/pre-commit` exit 0; `grep -q 'gitleaks' .github/workflows/ci-cd.yml` 0 exit. |
| NFR-05 | Accessibility | Rig nodes keyboard-reachable (`tabindex="0"`, `role="button"`, `aria-label`); popover `role="dialog" aria-modal="true"` with `[Esc ✕]` close; global `*:focus-visible` outlines; log areas `role="log"` + `aria-live="polite"`; headless Chrome audit at 1440×950 and 390×844 requires zero console/CSP errors and zero bounding-box collisions. | `grep -c 'aria-label=' index.html` ≥ 20; `grep -q 'role="dialog"' index.html` 0 exit; `grep -q 'focus-visible' v4.css` 0 exit; headless audit gate fails on any violation. |
| NFR-06 | Edge resilience (zero-origin profile) | Pages and catalogued media ride the edge cache; a k6 profile exercises `/` and the video slot with origin-hit accounting per the `ops/cf` runbook; the engine exposes `/healthz` so the 864 KB RSS prod measurement is mechanically re-checkable. | k6 zero-origin run on `/`: `origin_hits == 0` in the run summary (p95 recorded from the same run — measured, not an assumed threshold); `grep -q 'healthz' main.go` 0 exit. |

All acceptance paths are relative to `sites/v4/` unless the path names a repo-root file (`main.go`, `.githooks/`, `ops/cf`).

## 4. Rig extension (WF4, shipped)

The pre-WF4 SVG state (SF-05) gains additive interactive behaviors, shipped in `sites/v4/rig.js`; the SVG markup is unchanged.

| ID | Feature | Spec (1 line) | Acceptance (mechanical check) | Source files |
|---|---|---|---|---|
| SF-R1 | Click-popover (entity + metric + F-code chips) | Click/focus any rig node opens a popover dialog — tag `ENTITY // NN`, description, exactly one verified metric with a mechanical SSoT source line (`(src: …)`), plus a chip row bridging to `manifest.json` feature codes; closes via `[Esc ✕]` or Escape key. | `grep -qE 'id="rig-popover"[^>]*role="dialog"' index.html` 0 exit; `grep -q 'rig-popover-metric'` 0 exit; `grep -q 'FEATURE MAP BRIDGE'` 0 exit; `grep -q 'Escape' rig.js` 0 exit. | `index.html#rig-popover`, `rig.js` |
| SF-R2 | `/drill` palette | Terminal form accepts `/drill {edge, ingress, fleet, engine, harness, map, help}`; `map` prints the full entity→feature table; 7 quick-bar chips and `[data-drill]` buttons replay the identical command path; unknown targets log `unknown target — try /drill help` and fail closed. | `grep -c 'rig-chip-btn' index.html` = 7; `grep -q '/drill map' rig.js` 0 exit; `grep -q 'unknown target' rig.js` 0 exit. | `index.html#rig-cli-form`, `rig.js` |
| SF-R3 | Deterministic pulses | 4 path pulses (`edge→ingress`, `fleet→ingress`, `engine→fleet`, `engine→harness`) run a fixed 2.4s linear cycle with staggered delays 0.0/0.6/1.2/1.8s bound to `data-index` order — no randomness; under reduced motion they freeze (opacity .3, `animation: none`). | `grep -c 'rig-pulse-line' index.html` = 4; `grep -q 'animation-delay:.6s' v4.css` 0 exit; `grep -q 'animation-delay:1.2s' v4.css` 0 exit; `grep -q 'prefers-reduced-motion' v4.css` 0 exit (freeze fallback). | `index.html` (`#path-*`), `v4.css`, `rig.js` |

Acceptance paths relative to `sites/v4/`.

## 5. Out of scope / deferred

- Case-study subpages per act — deferred to v4.1; homepage carries claims + sources only.
- Feature-map UI beyond the reference grid — each project (g8s, Aegis) renders its feature map on its own subdomain; `site-v4` only references `manifest.json` IDs.
- Bilingual `/vi/` mirror — rejected for v4.0; EN-first by directive.
- Theme toggle — rejected for v4.0; the single OKLCH dark surface set is held stable.
- Client-side framework/bundler for this surface — v4 ships vanilla CSS+JS served as-is by the Go engine; no build step added for `sites/v4/**`.

## 6. Change control

Any change to `sites/v4/**` or to this spec rides the same PR gates as code — a spec edit
without a green gate is rejected by review:

- 8-gate zero-leakage pre-commit suite (`.githooks/pre-commit`).
- Stage 3 SHA-384 SRI + CSP verification (`scripts/verify-sri.sh`, engine-side CSP from `main.go`).
- The full 6-stage CI campaign (§8 lists the reference green run).

The row-level contract in §2–§4 is regression-safe on purpose: each grep turns the row into a
failable unit test of the spec, so drift in either direction (feature added without spec, spec
kept after feature removal) breaks a gate rather than a memory.

## 7. Regression checklist (one wave, per PR)

Run in order; fail fast. Paths relative to repo root; `V=sites/v4`.

```bash
bash .githooks/pre-commit && go test ./... && \
grep -c '' $V/index.html >/dev/null && \
for f in index.html v4.css v4.js rig.js; do gzip -c $V/$f | wc -c; done && \
grep -c '<script>' $V/index.html | grep -qx 0 && \
grep -c 'style="' $V/index.html | grep -qx 0
```

Then the visual/behavioral gates: headless Chrome audit (0 console/CSP errors, 0 collisions at
1440×950 and 390×844), the k6 zero-origin profile (origin_hits == 0), and a scripted pass of
`/drill` commands (`map`, `help`, unknown-target fail-closed). Reference green evidence: §8.

## 8. Verification evidence (campaign, 2026-10-31)

- CI run **#41189766268** — 6/6 stages green (supply-chain/DLP, SAST/SCA, SRI+E2E, Trivy/SBOM, DAST, gated CD/provenance).
- Prod runtime RSS — **864 KB** (measured via the `/healthz` probe).
- Gzip measured — html **7.5 KB**, css **5.1 KB**, js **6.7 KB total** (`v4.js` 2.9 KB + `rig.js` 3.7 KB) — inside NFR-02 per-file budgets.
- DLP — 8-gate pre-commit suite exit 0 on the v4 tree; DLP clean.

## Constraints

- Every acceptance is mechanical; when a cited grep turns `0` (feature removed), update that row in the same PR.
- The structure mirrors an openspec/speckit feature spec so future subdomain specs (g8s, Aegis) can adopt the same shape.
