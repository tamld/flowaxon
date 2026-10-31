# FlowAxon v4 — Worker Directive Ledger (v1, 2026-10-31)

**Mechanism note**: workers see ONLY their brief (uncommitted repo files are invisible from worktrees). Every future brief MUST embed the current ledger verbatim in its "Hard constraints" section. Traceability: each rule → brand brief §.

## A. Content
- A1 EN only; Vietnamese never renders on the public site (brand brief §2, §15).
- A2 REFERENCABILITY MANDATORY: every number/claim renders with a source link or measurement note; numbers without artifacts are labeled `operator-attested` — never dressed as measured (§11.1).
- A3 Never invent numbers, copy, or feature text; data-driven sections read manifest fields only (§13.1).
- A4 No hype words (revolutionary / cutting-edge / 10x / game-changing). Opinionated ≠ advertising (§5).
- A5 Operator-attested story metrics (Act I) keep the "essay pending" micro-label until an artifact exists (§11.1).

## B. Structure
- B1 Section set: hero → duality → one-thread → acts → surf-map → work → in-motion → collaborate/writing → footer. **The `features` section is REMOVED** (operator: feature maps belong to individual projects; the site's own feature map lives as a repo-level spec artifact, not homepage UI) (§13.1, §16-pending).
- B2 Per-project feature maps render on each project's own subdomain/site, attached to its interactive rig (§13.1, §14).
- B3 Contact = email + copy button ("copied ✓"), no form (§12).

## C. Design (tokens-v4.css is law)
- C1 Canvas #0a0e14 · grid 28px · panel rgba(12,17,24,.82) · borders #1c2530/#2a3644 · text tiers #eef4fb→#4d6a8a · sharp corners · dense control-panel rhythm · fixed dark, no theme toggle (§12).
- C2 Amber #f0a832 = proof/authority ONLY (receipts, gates, verified numbers). Per-act hues: rust/steel/amber (§14 canvas rule 4).
- C3 Canvas layer rules: L0 always on + max 2 layers per beat; L4 motion must be CAUSED by an L1/L2 event (no ambient randomness); transitions travel along structure; `prefers-reduced-motion` = instant states (§18).
- C4 Typography: Georgia serif display / ui-monospace labels; one sentence = one underlined keyword in captions; no caption exceeds 2 lines (§18 rule 6).

## D. Interaction (Visual Purpose Contract — §14)
- D1 Every visual states 4 things or is deleted: real entity / question text can't answer / interaction payoff / data source.
- D2 Every affordance DELIVERS: click → popover with real facts + F-code chips + one metric with source; `/drill` palette answers from real data; unknown command says so — no fake output (§13.2, §14).
- D3 A visual that promises interaction but doesn't deliver gets its affordance REMOVED, not faked (§13.2).

## E. Tech
- E1 CSP-first: zero inline `<style>`/`<script>` in shipped HTML; CSS/JS in external files; no CDN, no fetch(), no runtime dependencies (§13.3).
- E2 Budgets (amended 2026-10-31 post-WF4: raw limits were set pre-rig; gzip is the metric performance actually cares about): index ≤30KB raw · css ≤22KB raw **/ ≤6KB gz** · js ≤15KB raw / ≤4KB gz · rig.js ≤12KB raw · total page ≤20KB gz; video poster-first, lazy; loops ≤90KB; full ≤6MB (§9, §11). Measured at integration: html 7.5KB gz · css 5.1KB gz · js+rig 6.7KB gz — PASS.
- E3 SRI hashes generated at integration; assets content-hashed before CF Pages publish (§13.3, §15).
- E4 Deployment target: CF Pages + Workers (compute), R2 (media @ media.flowaxon.com); homelab is NOT the public-site origin (§15). Post-WF3b: ROOT is the single canonical source — sites/v4 retired (2026-11-01); Pages deploy dir = repo root; security headers ship via `_headers` (CF Pages native) mirroring main.go.

## F. Security / DLP (hard walls)
- F1 No RFC1918/CGNAT IPs, no internal hostnames, no CT1xx container IDs, no company/customer names — anywhere, ever. Say "the production host" (v3 handoff guardrails, §10).
- F2 Screenshots/frames pass the DLP checklist before publish (WV6 gate).

## G. Gates before any PR
- G1 8-gate pre-commit suite · SRI byte-match · headless CSP/DOM check · DAST probes (v3 pipeline stages 1-5) — green before dispatching PR.
- G2 Design polish gate: Impeccable pass (DESIGN.md formalization + craft-floor + verify-by-rendering) on completed surfaces; tasteskill pre-flight checklist as secondary lens (WF3b audit).
- G3 Load tests: k6 vs edge — p95 latency, cache-hit ratio, zero-origin resilience (site survives origin down) (§15c).

## H. Wave map (current)
WF4 rig (running) → integration (features-section removal + polish pass) → WF3b preview & swap → WF5 P0+CF Pages+k6 → WF7 wiki.py reflect → WV (operator items pending).

## I. Routing doctrine (operator directive 2026-10-31 — restated & now enforced)
- **Jev routes selection; workers execute; the coordinator decides and owns the outcome.** Every non-trivial selection (lane/provider/wave-order/skill-choice) runs `./bin/g8s reflex triage` FIRST — live Jev (Tier 1) → deterministic registries + skill-router (Tier 2) → F0 Brain override recorded (Tier 3, T3/T4 only).
- Jev verdicts are SENSOR readings, never decisions: `proceed` routes to workers, `escalate_hitl` goes to the operator as a scorecard.
- Jev is LIVE (verified 2026-10-31 16:24 UTC+: is_fallback=false, 963ms). First enforced application: the WF3b/polish/provider/WF7 selection — verdict `escalate_hitl` (risk 1.97) → operator scorecard.
