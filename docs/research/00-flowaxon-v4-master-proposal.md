# FlowAxon v4 Master Proposal — Portfolio Re-positioning & CI/CD Hardening

**Campaign**: fxv4 · **Coordinator**: ZCode session (F0) · **Date**: 2026-10-31
**Inputs**: 4 F1 research packets (`docs/research/10..13-*.md`) + F0 live-web benchmarks + F0 verification of every load-bearing claim.
**Status**: PROPOSAL — awaiting operator ratification. Nothing committed, nothing pushed.

---

## 0. Executive verdicts

| # | Question | Verdict |
|---|----------|---------|
| 1 | Is the current design fit for a personal portfolio? | **No (operator verdict + inventory).** The narrative exists (`manifest.json` `protagonist_and_storytelling` — a strong 3-act arc) but is never staged in the UI. The 3D isometric rigs carry visual weight without narrative weight. *Tier: OBSERVATIONAL — the operator's perception is the acceptance criterion; a rendered visual baseline is captured in WF0 before any further design claim is treated as fact.* |
| 2 | Are the 3D machines relevant? | **Only potentially.** The manifest itself assigns them narrative roles (Act II "Dual-Plane Homelab Rig", Act III "Live Constellation") that the rendered site fails to deliver. Re-stage them as *labeled, story-bound diagrams* or cut them. |
| 3 | Do we need a new framework? | **No (tradeoff judgment, gated).** Keep the Go-binary + static-assets + Vite build spine. Replace the presentation layer; motion = zero-dependency CSS scroll-driven animations + WAAPI + View Transitions (CSP/SRI-compatible, 0 KB added runtime). *Tier: UNVERIFIED_PROSE until WF0 mechanically runs the actual CSS on target browsers.* |
| 4 | Is the story missing? | **No — it is buried.** Rewrite `protagonist_and_storytelling` into site copy; the 3-act arc becomes the homepage spine. EN-led language policy (unverified preference — see §0.1 A1). |
| 5 | Is the 6-stage CI/CD sufficient? | **Push-time: yes, above personal-site baseline. Between pushes: no.** Verified gaps: no `schedule:` trigger (Trivy/DAST never re-run between commits), SBOM generated but never consumed (no grype gate), no cosign verify, no Renovate/Dependabot, no CODEOWNERS/SECURITY.md. Already strong (verified): SHA-pinned actions, Harden-Runner egress audit, Gitleaks, gosec/Semgrep/govulncheck, SRI+CSP gate, distroless+Trivy, SLSA provenance. |

## 0.1 Epistemic audit & red-team amendments (post-challenge, 2026-10-31)

Applied `g8s-epistemic-audit` framework manually (CLI surface `g8s epistemic` absent in v0.21.0 — skill describes a newer/planned command). Claims decomposed and tiered:

| ID | Load-bearing claim | Tier | Basis / gap |
|----|--------------------|------|-------------|
| C1 | Manifest contains 3-act arc + protagonist thesis | MECHANICAL_VERIFIED | `jq` on manifest.json |
| C2 | "Narrative never staged in the UI" | UNVERIFIED_PROSE → gated | Inherited from WS1, whose file/line citations were proven hallucinated; no rendered-site evidence exists yet → WF0 baseline screenshot required |
| C3 | 3D rigs story-disconnected | OBSERVATIONAL_TELEMETRY | Operator verdict is the primary acceptance signal; manifest role-assignment is mechanical (C1) |
| C4 | CSP `style-src 'self'` + SRI byte-match enforced | MECHANICAL_VERIFIED | `scripts/verify-sri.sh`, CI Stage 3 step names |
| C5 | Zero-dependency motion viable | UNVERIFIED_PROSE → gated | WS2 prose; WF0 must mechanically verify on target browsers |
| C6 | Keep Go spine | UNVERIFIED_PROSE (justified tradeoff) | Counter-proposal (Astro islands) acknowledged, not priced rigorously; revisitable at WF0 |
| C7–C10 | CI/CD gaps & strengths (schedule/cosign/grype/Renovate/CODEOWNERS absent; egress/Gitleaks/SHA-pins present) | MECHANICAL_VERIFIED | Direct grep/ls of `.github/workflows/ci-cd.yml` + `.github/` |
| C11 | P0 "nightly DAST vs prod" | UNVERIFIED_PROSE → AMENDED (A2) | Probing prod from CI runners is fragile/noisy; mechanism redesigned |
| C12 | Direction B recommendation | UNVERIFIED_PROSE | Thesis-fit ≠ taste-fit; operator taste never sampled → taste interview added to WF0 |
| C13 | EN-led language | UNVERIFIED_PROSE | No audience evidence; cheap to flip pre-WF1 |
| C14 | "F-01..F-12 dies" | UNVERIFIED_PROSE → AMENDED (A3) | Kill-list overstated; survives as machine-readable data |

**Amendments adopted:**
- **A1 — WF0 preconditions double**: (a) capture rendered visual baseline of the current site (screenshots, phone + desktop) — design claims graduate from prose to evidence only against it; (b) 3-reference taste interview with the operator BEFORE building the direction mockup.
- **A2 — P0 mechanism refined**: nightly scheduled job pulls the PUBLISHED `ghcr` image → Trivy + grype re-scan the artifact (not prod); DAST probes run against an ephemeral container (Stage 5 pattern, never prod); a separate lightweight uptime + cert-expiry check targets prod (read-only GET).
- **A3 — F-01..F-12**: removed from visual UI only; retained in `manifest.json` as machine-readable data (llms.txt / API consumers).
- **A4 — C5 gate**: WF0 mockup uses the real CSS scroll-driven + View Transitions code and must pass on Chrome + iOS Safari before WF2 is priced.
- **A5 — counter-proposal priced at WF0**: Astro-islands rebuild gets a one-page cost/benefit vs status-quo spine; decision recorded before WF2.

## 1. Design directions (operator picks one)

- **A — Austere Editorial**: monochrome + one accent, typographic hierarchy, text-first case studies. 3D rigs cut. Effort M. Best reference: brittanychiang.com pattern (clean minimal, case-study driven — live-web benchmark).
- **B — Engineering Blueprint**: diagram-centric, monospace telemetry, tool-stack tables; the aesthetic literally embodies the owner's core thesis ("deterministic substrate for autonomous AI"). 3D rigs REUSED as two labeled architecture diagrams: (1) F0/F1/F2 containment constellation, (2) dual-plane homelab rig. Effort L.
- **C — Immersive Narrative**: journey timeline with rigs as milestone markers, warm accents, portrait hero. Effort S–M; perf risk on low-end devices.
- **F0 recommendation: B with A's typographic restraint** ("blueprint spine, editorial discipline"). Rationale: differentiation + thesis-fit + the rigs already exist and finally earn meaning. Falsification test before commitment: single-page HTML mockup of hero + one act section, judged on a phone, before any pipeline work.

## 2. Narrative (from WS3 + manifest, F0-merged)

- **Positioning (recommended)**: merge "AI factory" + "trust engineer" —
  *"I build deterministic harnesses that make autonomous AI production-safe."*
  Proof anchors: g8s (receipts, containment), Aegis (blast doors), the 6-stage pipeline itself, CT126 fleet.
- **Homepage arc** = the manifest's three acts: Act I crisis command (48h ransomware recovery) → Act II arithmetic of determinism → Act III symbiotic frontier. Each act ends in a verifiable artifact link.
- **Dies**: F-01..F-12 feature-map framing, "machines" tech-demo copy, generic hero. **Survives**: manifest-driven build, constellation framing (reduced to one diagram), the DevSecOps pipeline (becomes a proof page, not a flex).
- **Language**: English-led (open-source credibility); optional `/vi/` later — bilingual from day one is rejected (doubles copy maintenance for solo operator).

## 3. Tech stack (from WS2, enforcement claims pruned)

- Spine unchanged: Go 1.22 static binary (~770 KB RSS), distroless OCI, Cloudflare → Traefik → rootless podman.
- Build unchanged in kind: Node build scripts → static assets; `manifest.json` stays the SSoT that generates content.
- Motion: CSS `animation-timeline` + WAAPI + View Transitions only. GSAP rejected (GPL + CSP friction); Three.js rejected (~100 KB + WebGL for decoration).
- Budgets: JS ≤ 50 KB gz, CSS ≤ 20 KB gz, LCP ≤ 2.0 s mobile, CLS ≤ 0.1 — enforced by extending the existing headless-Chrome stage (NOT by WS2's invented `subset-fonts.mjs`/`image-check` mechanisms, which do not exist).
- NOTE (verified): WS1's benchmark URLs and line-level "evidence" citations were hallucinated and are discarded; direction and diagnosis retained only where they match F0-verified facts. WS4's control inventory is superseded by the F0 verification in §4.

## 4. CI/CD verdict & backlog (F0-verified against actual `ci-cd.yml`)

**Verdict, three lenses**: personal portfolio → **sufficient** (above baseline) · DevSecOps showcase → **not yet closed-loop** (controls are declared and run once, but nothing re-verifies them over time) · production constellation → **not yet** (no drift detection between pushes).

| Pri | Item | Why | Effort |
|-----|------|-----|--------|
| P0 | `schedule:` nightly run: pull published `ghcr` image → Trivy + grype re-scan (fail HIGH/CRITICAL); DAST probes vs ephemeral container; read-only uptime + cert-expiry GET vs prod | pipeline only verifies at push-time; SBOM never consumed (mechanism per §0.1 A2) | S–M |
| P0 | `SECURITY.md` + `CODEOWNERS` | both missing (verified) | S |
| P1 | Renovate config | zero dependency automation (verified) | M |
| P1 | cosign keyless sign + `cosign verify` step after publish | provenance attested, signature never verified | M |
| P1 | Lighthouse CI budgets wired into Stage 3 (headless Chrome already there) | no perf/a11y gate exists | S |
| P2 | OSSF Scorecard step; visual regression (screenshot diff vs baseline); uptime/cert-expiry alerts via Cloudflare | polish, governance evidence | M–L |

Explicitly rejected: per-PR preview environments (solo operator, low ROI), container auto-update on host (manual signed-image rollout is adequate).

## 5. Execution waves (post-ratification; every wave = brief → `g8s submit` → worker → verify → PR)

- **WF0** (gate): (a) rendered visual baseline of the current site — screenshots phone + desktop; (b) operator taste interview — 3 reference sites, pick what "beautiful" means here; (c) direction mockup — one static HTML page (hero + Act I) with the REAL motion CSS, verified on Chrome + iOS Safari; (d) Astro-vs-spine cost/benefit note recorded. No pipeline work before this passes.
- **WF1**: content SSoT — rewrite `manifest.json` `protagonist_and_storytelling` + full EN copy deck (hero variants, act sections, proof blocks). PR (docs).
- **WF2**: design tokens + layout skeleton per chosen direction (CSS OKLCH tokens, type scale, section grid). PR.
- **WF3**: homepage rebuild: hero → 3 acts → proof → contact; kill F-01..F-12 framing. PR.
- **WF4**: rig re-staging — constellation + homelab rigs as labeled, story-bound figures (or removal if Direction A). PR.
- **WF5**: CI/CD P0 batch (nightly schedule + grype gate + SECURITY/CODEOWNERS). PR.
- Per-wave gates: 8-gate pre-commit suite + SRI byte-match + headless CSP/DOM + DAST probes; screenshot baseline captured BEFORE WF2 as the red-test reference; every merge green on the 6-stage pipeline before the next wave starts.

## 6. Research artifacts on disk (uncommitted, awaiting ratification)

`docs/research/00-` (this file), `10-` (design), `11-` (stack), `12-` (narrative), `13-` (CI/CD audit). Provenance notes inside each file mark supervisor-transcribed content. To be committed with WF1 or discarded at operator discretion.
