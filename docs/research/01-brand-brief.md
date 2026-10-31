# FlowAxon v4 Brand Brief (SSoT for WF1 copy + WF2 design)

**Ratified by operator 2026-10-31** (scorecard session). This file governs all copy and design decisions. Changes require operator stamp.

## 1. Positioning

**One line**: *I build the trust layer for autonomous AI agents — the engine agents obey, the console humans command.*

**Paragraph**: 11 years of production infrastructure — from recovering 100+ ransomware-crippled endpoints in 48 hours to running a Proxmox/podman fleet in production today. Now building g8s (containment, receipts, durable controlplane) and Aegis (runtime blast doors) so that AI agents can operate real infrastructure without anyone betting the fleet on a probabilistic prompt.

## 2. Destinations (priority order — operator-ratified)

1. **Elite hire track** (primary): staff/principal AI-infrastructure credibility, international.
2. **Consulting** (secondary): AI-safety / orchestration infrastructure engagements.
3. **Builder-in-public** (tertiary): the AI-factory journey as content.

**Audience**: international-first (EN-led), domestic VN later. Portfolio language: English.

## 3. Product narrative — the trust duality

| | g8s | Aegis |
|---|---|---|
| Role | **Core engine for trust** | **Framework that concretizes trust for users** |
| Facing | Agent-facing: agents are its primary users | Human-facing: approval, interception, blast doors |
| One-liner | "The engine agents obey." | "The console humans command." |
| Proof artifacts | receipts, containment rings, durable queue, CI 6-stage | runtime interception, human-in-the-loop gates |

Portfolio stages the DUALITY: one system, two views — what the agent must obey (g8s view: receipts, scopes, worktrees) and what the human controls (Aegis view: gates, approvals, kills). Same trust story, both sides of the door.

## 4. Site philosophy — the launchpad (operator directive)

The page is a **launchpad, not a brochure**: a dynamic surface for demonstrating capability and nerve. Sanctioned experimental surfaces (each must still earn its place by carrying real data or story):

- **Scoreboard** — live project telemetry (CI runs, receipts, uptime, RSS), real numbers only.
- **Charts** — hand-rolled SVG, story-bound (Act I scrubber counts, pipeline stage history).
- **Short video** — self-hosted WebM clips (≤5s loops: terminal receipts, rig rotation) where a static frame loses meaning.
- **Interactive demos** — dispatch demo (Act III), 48h scrubber (Act I) — signature interactions.
- Orchestration rule: every surface is coordinated into the narrative arc; nothing decorative-only.

## 5. Voice — opinionated (operator pick: 6-B)

Thesis-driven, takes stands, essays are weapons; engineering rigor retained (every stance backed by a named artifact). No hype adjectives. First person, senior, sharp.

## 6. Hero claim — 3 variants (7-D: coordinator proposes, operator picks)

- **H1 (provocative)**: "Autonomous AI agents are already in production. Most of them have no brakes. I build the brakes."
- **H2 (biographical)**: "11 years of production infrastructure. Now I build the trust layer that lets AI agents operate it."
- **H3 (reflexive)**: "I don't trust AI agents. That's why I build systems that make them trustworthy."

## 7. Measured goal (8-A)

Recruiter/peer inbound via site: **≥ 6 real conversations within 12 months of v4 launch** (operator-set N pending adjustment). Counted manually; not displayed on the site.

## 8. Essay seeds (10-A, to be finalized)

1. *Determinism is a product feature* — why probabilistic output needs deterministic substrate (from wiki insight).
2. *Your AI agent needs a receipt, not a prompt* — the 1:1 receipt doctrine as product design.
3. *The arithmetic of one manual click* — 3 seconds / 3 hours / 3 years, operational math as strategy.

## 9. Design direction (proposed — awaiting single stamp)

**B-spine (Blueprint × Editorial)**, dark, 3D rigs kept and re-staged as labeled narrative diagrams (Act II dual-plane rig, Act III constellation), sharp corners, dense control-panel rhythm — with editorial restraint from Direction A on all copy surfaces. Rationale: "dynamic launchpad + scoreboard + charts + opinionated" all describe Direction B's native language; A's typographic discipline prevents it becoming a noisy dashboard.

## 10. Guardrails

- DLP: no internal IPs/hostnames/CT IDs/company names in any public asset — screenshots pass checklist before use.
- Exposure level: professional (9-B) — no personal-life content; portrait optional.
- Performance budget unchanged: JS ≤ 50 KB gz, LCP ≤ 2 s, 60 fps, `prefers-reduced-motion` honored.
- Stack unchanged: Go binary + static + Vite; zero new runtime dependencies.

## 11. WF0 operator feedback — amendments (2026-10-31, four directives)

1. **REFERENCABILITY IS MANDATORY.** Every number, chart, and claim on the site carries a visible source: link to the CI run, the repo, the API endpoint, or an explicit measurement note ("prod container, measured 2026-10-31"). Unreferenced numbers do not ship. Operator-attested story metrics (Act I) are labeled as attested, not measured, until an artifact is published.
2. **Narrative arc: fragments → whole.** The page assembles from pieces (acts, projects, data) toward a synthesis that answers two questions explicitly: *"Who am I — what drives me?"* and *"If someone collaborates with me, what are they buying?"* A dedicated synthesis + collaboration section is required, not implied.
3. **Media mix is deliberately plural**: color-coded sections, charts, short self-hosted video (operator has a g8s video profile — assets to be supplied), motion, interaction, and component polish benchmarked to shadcn/ui quality bars — WITHOUT the React dependency (shadcn is a design-language reference, not a stack change; adopting shadcn-proper would flip the stack decision and needs an explicit operator trade-off).
4. **THE UNIFICATION THESIS (the deep "why", operator-stated)**: origin — cmd scripts and company automation gave birth to the automation mindset. Burning passion: *"take what is repetitive, organized, disciplined — and unify it into one place"* (đưa về 1 mối). Method: top-down vision first, then lateral. This thesis is the through-line that unifies all acts and projects: Act I = automation born, Act II = unification doctrine, Act III = the harness that unifies agents. The site must make this one thread VISIBLE (visually connected, not just implied).

## 12. WF0 LOCK (operator scorecard, 2026-10-31 — "Duyệt theo option đánh sao")

Hero **H1** ("no brakes") · density **dense control-panel** · sections **all 8 kept** (case-study subpages deferred to v4.1) · accent **amber + per-act hues** (rust/steel/amber) · **fixed dark** (no toggle) · contact **email + copy button** (no form). Canvas layer spec ratified separately (`18-canvas-layer-spec.md`). WV4 ratified: dual-channel audio (EN VO + music + full on-screen text). Video hosting: Cloudflare R2 @ `media.flowaxon.com` (`17-video-workstream-plan.md`). Essays ship as outlines in v4.0, full drafts follow.

## 13. WF3 directives (operator addenda, 2026-10-31 late)

1. **FEATURE MAP IS NOT CUT** — supersedes A3's "remove from visual UI". `manifest.json` `feature_map` (F-01..F-12) renders as a data-driven block (v4.0: index strip; v4.1: full explorer). Every F-code keeps its real artifact link — referencable like all numbers.
2. **THE 3D RIG MUST BE INTERACTIVE — the v3 weakness**: the current rig *promises* "CLICK LAYER CARRIAGES OR RUN /DRILL" but delivers nothing meaningful. WF4 spec: every rig component is clickable → popover with component facts + linked F-codes from the feature map + live telemetry; terminal-style `/drill` palette retained as the power-user path. A visual that promises interaction must deliver it — otherwise cut the affordance.
3. **CSP-first build**: `sites/v4/` ships with external `v4.css`/`v4.js` only (zero inline style/script) — CSP `style-src 'self'` compliance from day one, not retrofitted. SRI hashes generated at integration time (WF3b swap).
4. CI/CD P0 batch (WF5: nightly rescan + grype SBOM gate + SECURITY.md/CODEOWNERS) stays on the critical path after WF4 — unchanged.

## 14. Visual Purpose Contract ("rác công nghệ" rule — operator, 2026-10-31)

**Every visual must state four things or it does not ship**: (1) the REAL entity it represents, (2) the question it answers that text cannot, (3) the interaction payoff it delivers, (4) its data source (manifest field / measurement / repo). A visual built without purpose is technology garbage — delete it.

**The constellation rig's purpose (ratified)**: it is not an illustration — it is the **deployment map of the machine serving the page you are reading**. Every block = a real running entity (edge WAF/TLS → ingress Traefik → fleet Proxmox/podman → engine Go binary 864KB measured → harness g8s controlplane + Aegis gates). Click any block: what it is, one real metric, which F-codes live there. `/drill` = operator query path. Any block with no real entity behind it is removed. Self-referential proof: the site diagrams its own real deployment — the ultimate referencability.

## 15. Deployment positioning v4 (operator, 2026-10-31 late)

**CF = ingress + compute. Homelab = where servers live. R2 = media.** Cloudflare's free tier is the goldmine for solo builders: Pages (static, unlimited band), Workers (dynamic endpoints), R2 (zero-egress media), WAF/TLS — one account, zero server ops for the public site. The homelab keeps hosting the real workloads (g8s instances, internal services) — it stops being the public site's origin dependency. Consequences: (a) WF5 CI/CD gains a CF Pages deploy stage (wrangler) alongside GHCR; (b) manifest `tech_stack` v4 story updates accordingly (edge-computed static + Workers dynamic, media on R2, fleet = internal services); (c) **load tests required**: k6 against the edge deployment — p95 latency, cache-hit ratio, zero-origin resilience (P1, mechanically validated); (d) campaign close ritual: `wiki.py reflect` → persist I-/R-/A- notes into the LLM wiki (I-FlowAxon-v4 architecture insight, R-visual-purpose-contract, A-cf-pages-solo-builder-stack playbook).
