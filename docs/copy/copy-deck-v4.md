# FlowAxon v4 Copy Deck

> Complete English copy contract for FlowAxon portfolio v4 (WF3 homepage build).  
> Design token context: Dark blueprint theme, dense control-panel layout, amber accent (`#f59e0b`), per-act chromatic hues (rust `#ea580c`, steel `#94a3b8`, amber `#f59e0b`).  
> Reference standard: Verbatim implementation string constants; referencability enforced via inline source annotations `(src: …)`.

---

## 1. meta

| Key | Copy / Content Value | Token / Spec |
| :--- | :--- | :--- |
| `title` | FlowAxon — Autonomous Agent Systems Architecture | Max 60 chars |
| `description` | AI agent systems architect building containment rings, fail-closed harnesses, and governance for autonomous agents in production. | 130 chars (≤155 chars) |
| `og:title` | FlowAxon — Autonomous Agent Systems Architecture | OpenGraph standard |
| `og:description` | Autonomous AI agents are already in production. Most have no brakes. I build the brakes. | Social card excerpt |
| `og:image:alt` | FlowAxon v4 blueprint schematic showing g8s containment rings and Aegis blast doors | Accessibility metadata |
| `llms.txt:one-liner` | Tam Le-Duc (tamld): AI agent systems architect, g8s author, Proxmox/podman fleet operator, building fail-closed harnesses and runtime containment for autonomous agents. | llms.txt index standard |

---

## 2. hero

### Header & Subtitle
- **Kicker:** `$ whoami — AI agent systems architect · 11y production · UTC+7`
- **H1 Headline:** `Autonomous AI agents are already in production. Most have no brakes. I build the brakes.`
- **Sub-headline:** `Eleven years of operating real infrastructure — from a 48-hour ransomware crucible to a Proxmox/podman fleet in production. One drive underneath it all: take what repeats, and make it obey — one system, seen from above. g8s is the engine agents obey; Aegis is the console humans command.`

### Feature Chips
- `g8s`
- `Aegis`
- `6-stage zero-trust CI`
- `SLSA attested`
- `EN-first`

### Stat Cards
1. **Card 1 (Telemetry)**
   - **Value:** `1,146`
   - **Label:** `Repos surfed`
   - **Source:** `(src: github.com/tamld stars, fetched 2026-10-31)`
2. **Card 2 (Pipeline)**
   - **Value:** `6/6`
   - **Label:** `CI stages green`
   - **Source:** `(src: run #41189766268)`
3. **Card 3 (Footprint)**
   - **Value:** `864 KB`
   - **Label:** `RSS prod container`
   - **Source:** `(src: measured 2026-10-31)`
4. **Card 4 (Governance)**
   - **Value:** `1:1`
   - **Label:** `issue = worker = receipt`
   - **Source:** `(src: g8s cardinality law)`

---

## 3. sections

### 01 Duality
- **Section Kicker:** `01 // ARCHITECTURAL SPLIT`
- **Section Heading:** `Duality: The Engine and The Console`
- **Section Subtext:** `Autonomous agents require dual-plane orchestration: mechanical execution limits beneath, calibrated human authority above.`
- **Left Column — g8s:**
  - **Role Kicker:** `ENGINE // AGENT-FACING`
  - **Title:** `The engine agents obey`
  - **Body:** `Agents execute strictly inside mechanical boundaries. Containment rings F2 ⊆ F1 ⊆ F0 enforce strict syscall isolation, while single-use path-scoped write receipts guarantee zero unrecorded file mutations. Every task runs in a fail-closed ephemeral worktree backed by an immutable SQLite controlplane.`
  - **Badges:** `F2⊆F1⊆F0 Rings` · `Scoped Write Receipts` · `Fail-Closed Worktrees` · `SQLite Controlplane`
  - **Visual Alt-Text:** `Architecture diagram detailing g8s containment rings F2 within F1 within F0 around worker sandboxes`
- **Right Column — Aegis:**
  - **Role Kicker:** `CONSOLE // HUMAN-FACING`
  - **Title:** `The console humans command`
  - **Body:** `Humans command intent without drowning in execution logs. Runtime interception blast doors catch policy deviations before disk writes commit, routing high-impact operations into explicit human-in-the-loop review queues. AST-level mutation guards block hazardous edits while preserving proportional governance.`
  - **Badges:** `Runtime Interception` · `Blast Doors` · `HITL Approvals` · `AST Mutation Guards`
  - **Visual Alt-Text:** `Interface schematic of Aegis operator console with real-time intercept triggers and diff inspector`

### 02 Acts (One Thread)
- **Section Kicker:** `02 // TRAJECTORY`
- **Section Heading:** `One Thread: Take What Repeats, Make It Obey`
- **Section Intro:** `The tool changes across eleven years; the doctrine remains unbroken. A single trajectory runs from Windows shell scripts to bare-metal homelabs to multi-agent harnesses.`
- **Timeline Overview:**
  - `2016` — *Company floor:* cmd scripts kill repetition → automation mindset born.
  - `2021` — *The doctrine:* top-down vision then lateral: homelab becomes one governed system.
  - `2025` — *The harness:* g8s unifies agent chaos under receipts and rings.
- **Act I (2016, Rust Hue `#ea580c`):**
  - **Act Badge:** `ACT I · 2016 · RUST`
  - **Act Title:** `Automation is born`
  - **Headline:** `The 48-hour ransomware crucible`
  - **Body:** `Faced with an encrypted company network, manual triage was a guaranteed failure. A custom cmd scrubber automated recovery across 100+ endpoints simultaneously. Three coordinated squads executed the playbook; production resumed with zero Monday downtime.`
  - **Annotation:** `(src: operator-attested, essay pending)`
- **Act II (2021-2024, Steel Hue `#94a3b8`):**
  - **Act Badge:** `ACT II · 2021-2024 · STEEL`
  - **Act Title:** `The unification doctrine`
  - **Headline:** `The arithmetic of one manual click`
  - **Quote:** `"1 manual click takes 3 seconds. 1 automated script takes 3 hours. 100 flawed clicks cost 3 years."`
  - **Body:** `Disparate homelab nodes unified into a single governed appliance. Single DHCP authority eliminates address drift, dual-plane telemetry correlates metrics across private subnets, and zero WAN exposure protects container runtimes without relying on third-party bastions.`
  - **Annotation:** `(src: operator-attested)`
- **Act III (2025→now, Amber Hue `#f59e0b`):**
  - **Act Badge:** `ACT III · 2025→NOW · AMBER`
  - **Act Title:** `The harness that unifies agents`
  - **Headline:** `Deterministic harness for probabilistic models`
  - **Body:** `Language models hallucinate; software engineering cannot. g8s binds agent dispatch into a deterministic pipeline: incoming brief, atomic claim, isolated worktree, mechanical validation, and cryptographic receipt. Chaos becomes reproducible work.`
  - **Pipeline Flow:** `brief → claim → worktree → receipt`
  - **Interactive Alt-Text:** `Interactive dispatch terminal simulation showing live agent claim-to-receipt progression`

### 03 Surf Map
- **Section Kicker:** `03 // CURATION RADAR`
- **Section Heading:** `Five years of riding the wave.`
- **Section Subtext:** `Continuous reconnaissance across the software frontier. 1,146 repositories star-curated, categorized, and stress-tested in production workflows.`
- **Annotation:** `(src: github.com/tamld stars, n=1,146)`
- **Chronological Volume (Bars):**
  - `2022`: 183 repos
  - `2023`: 186 repos
  - `2024`: 106 repos
  - `2025`: 456 repos
  - `2026`: 212 repos
- **Domain Clusters:**
  - `ai`: 114
  - `agents`: 81
  - `docker`: 68
  - `cli`: 50
  - `claude-code`: 49
  - `linux`: 46
  - `golang`: 36
  - `mcp`: 26
- **Visual Alt-Text:** `Bar chart and cluster matrix visualizing 1,146 starred GitHub repositories distributed across 5 years and 8 key architectural domains`

### 04 Work
- **Section Kicker:** `04 // PRODUCTION SYSTEMS`
- **Section Heading:** `Core Architecture & Systems`
- **Card 1 — g8s:**
  - **Title:** `g8s — Autonomous Agent Harness`
  - **Tagline:** `Coordinator harness for bounded agent execution`
  - **Metric Badge:** `v0.21 releases · 21+`
  - **Body:** `Multi-agent coordinator enforcing strict task cardinality, ringed filesystem barriers, and deterministic worktree isolation. Replaces opaque loops with verifiable execution receipts.`
  - **Link Label:** `View repository →`
  - **Source Annotation:** `(src: github.com/tamld/g8s)`
- **Card 2 — Aegis:**
  - **Title:** `Aegis — Runtime Blast Doors`
  - **Tagline:** `Interception console for high-stakes agent mutations`
  - **Metric Badge:** `0 unreviewed mutations`
  - **Body:** `Runtime supervision engine executing AST-level mutation checks and policy interception. Guarantees zero out-of-bounds filesystem mutations reach staging without human consensus.`
  - **Link Label:** `Inspect architecture →`
  - **Source Annotation:** `(src: github.com/tamld/aegis)`
- **Card 3 — The Constellation:**
  - **Title:** `The Constellation — Unified Fleet Edge`
  - **Tagline:** `3 subdomains served from one minimal footprint`
  - **Metric Badge:** `6/6 stages green`
  - **Body:** `Single-binary Go server driving production edge routing across three secure subdomains. Hardened with SLSA provenance, zero-trust automated CI, and an ultra-lean memory profile.`
  - **Link Label:** `Inspect build receipt →`
  - **Source Annotation:** `(src: github.com/tamld/flowaxon)`

### 05 In Motion
- **Section Kicker:** `05 // SYSTEM IN MOTION`
- **Section Heading:** `Autonomous Orchestration in Real Time`
- **Section Subtext:** `Some things only video can say.`
- **Video Assets & Controls:**
  - **Looping Teaser:** `5-second fan-out loop · 88 KB · WebM/MP4`
  - **Full Demo:** `2-minute architecture explainer · 5.5 MB (EN re-render queued)`
  - **Poster Frame Label:** `g8s multi-agent dispatch state transition matrix`
  - **Media Caption:** `Live demonstration of multi-agent concurrency: one issue spawning isolated worktrees, bounded execution, and mechanical verification receipts.`
  - **Visual Alt-Text:** `High-density terminal recording showing concurrent agent task workers completing isolated Git commits under g8s supervision`

### 06 Collaborate
- **Section Kicker:** `06 // ENGAGEMENT`
- **Section Heading:** `Deploy Systems, Not Experiments`
- **Pillars of Engagement:**
  - **Pillar 1:** `You bring chaos, I return a system`
    - **Body:** `When autonomous agent experiments sprawl into flaky prompts and fragile workflows, I architect the containment boundaries, state machines, and fail-closed policies that restore control. You get auditable workflows with guaranteed invariants instead of opaque agent loops.`
  - **Pillar 2:** `Agents you can bet production on`
    - **Body:** `Autonomous code execution requires hard blast doors, isolated worktrees, and mechanical verification gates before anything touches trunk. I engineer production architectures where agents operate inside verified rings without risking data loss or system integrity.`
  - **Pillar 3:** `Systems that prove themselves`
    - **Body:** `Every action produces a cryptographic receipt, and every deployment satisfies zero-trust CI gates before shipping. Trust is not assumed through prompt engineering; it is enforced through deterministic evidence and measurable telemetry.`
- **Who-I-am Block:**
  - **Heading:** `Who I am`
  - **Body:** `"I am the person who cannot watch something repeat twice without building the system that ends it. Cmd scripts became a homelab doctrine; the doctrine became a harness for AI agents. Same screw, three turns — and I'm not done turning it."`
- **Contact Action:**
  - **Label:** `Direct Channel`
  - **Email Address:** `hello@flowaxon.com`
  - **Copy Action Label:** `Copy email`
  - **Copied State:** `copied ✓`

### 07 Writing
- **Section Kicker:** `07 // DISPATCHES`
- **Section Heading:** `Essays on Systems & Autonomous Engineering`
- **Section Subtext:** `Architectural notes from eleven years in production. Outlines ship first.`
- **Essay 1:**
  - **Title:** `Determinism is a product feature`
  - **Status:** `Outline ready · Essay pending`
  - **Teaser:** `Why non-deterministic workflows fail production economics, and how bounded state machines bring repeatable delivery to probabilistic LLM agents.`
- **Essay 2:**
  - **Title:** `Your AI agent needs a receipt, not a prompt`
  - **Status:** `Outline ready · Essay pending`
  - **Teaser:** `Prompts guide intention; receipts prove execution. A specification for cryptographic audit trails and path-scoped write tokens in multi-agent pipelines.`
- **Essay 3:**
  - **Title:** `The arithmetic of one manual click`
  - **Status:** `Outline ready · Essay pending`
  - **Teaser:** `The true cost calculation behind manual operational debt, learned during a 48-hour ransomware crucible and codified across four years of homelab operations.`

### Footer
- **Direct Mail:** `hello@flowaxon.com`
- **GitHub Profile:** `github.com/tamld`
- **Security Policy:** `/.well-known/security.txt`
- **Copyright & Standard:** `© 2026 FlowAxon · Deterministic Systems Architecture · EN-first`

---

## 4. microcopy

### Navigation & Top Bar
- `nav.brand`: `flowaxon`
- `nav.duality`: `01 Duality`
- `nav.acts`: `02 Acts`
- `nav.surf`: `03 Surf Map`
- `nav.work`: `04 Work`
- `nav.motion`: `05 In Motion`
- `nav.collaborate`: `06 Collaborate`
- `nav.writing`: `07 Writing`
- `nav.status`: `SYSTEM ONLINE · 6/6 CI GREEN`

### Accessibility & Aria Labels
- `aria.nav`: `Primary navigation`
- `aria.theme`: `Theme toggle (locked to Dark Blueprint)`
- `aria.copy_email`: `Copy contact email address to clipboard`
- `aria.surf_chart`: `Star history bar chart showing repository distribution by year`
- `aria.dispatch_demo`: `Interactive terminal demonstrating agent dispatch workflow`
- `aria.video_player`: `FlowAxon multi-agent architecture video presentation`

### State & Action Microcopy
- `btn.copy`: `Copy email`
- `btn.copied`: `copied ✓`
- `btn.replay`: `Replay sequence`
- `btn.pause`: `Pause telemetry`
- `state.loading`: `Attesting environment...`
- `state.empty_filter`: `No repositories match active cluster filter.`
- `state.error_boundary`: `Telemetry feed interrupted. Preserving cached metrics.`
- `scrubber.act_1`: `Act I — 2016 Crucible`
- `scrubber.act_2`: `Act II — 2021 Doctrine`
- `scrubber.act_3`: `Act III — 2025 Harness`

### Dispatch Demo Log Lines (Terminal Console)
```text
[00:01.042] DISPATCH task=issue-1048 role=worker worker_id=w-4a11f ring=F1
[00:01.189] ISOLATE worktree=/wt/issue-1048 branch=feat/auth-guard base=main
[00:02.405] EXECUTE tool=ast_patch target=auth.go status=in_progress
[00:03.112] VERIFY red_test=PASS static_analysis=CLEAN coverage=100%
[00:03.890] RECEIPT issue=1048 worker=w-4a11f receipt_hash=sha256:7f9c2d1
[00:04.015] CLOSEWORKTREE merged=false receipt_stored=true state=reaped
```

---

## 5. sources

| Claim / Metric | Section | Source Value | Verification Note / Reference URI |
| :--- | :--- | :--- | :--- |
| `1,146 repos surfed` | Hero / 03 Surf | `github.com/tamld stars` | Fetched live via GitHub GraphQL API, 2026-10-31 |
| `6/6 CI stages green` | Hero / 04 Work | `run #41189766268` | GitHub Actions workflow execution receipt |
| `864 KB RSS prod container` | Hero | `measured 2026-10-31` | Runtime memory footprint in production podman container |
| `1:1 issue = worker = receipt` | Hero | `g8s cardinality law` | Architectural invariant defined in g8s supervisor specification |
| `100+ endpoints, 0 downtime` | 02 Acts (Act I) | `operator-attested` | Production incident response ledger (essay pending) |
| `Single DHCP, dual-plane, 0 WAN`| 02 Acts (Act II) | `operator-attested` | Homelab CT fleet infrastructure configuration |
| `v0.21 releases · 21+` | 04 Work (g8s) | `github.com/tamld/g8s` | GitHub repository release tags |
| `0 unreviewed mutations` | 04 Work (Aegis)| `github.com/tamld/aegis` | Invariant enforced by AST gate test suite |
| `3 subdomains, single binary` | 04 Work (Constellation) | `github.com/tamld/flowaxon` | Production build binary deployment artifact |
| `88 KB loop / 5.5 MB explainer`| 05 In Motion | `local asset build` | FFmpeg optimized web video renders |

---

## 6. style-notes

- **Sentence Length:** Keep prose dense and rhythmic (12–18 words per sentence). Avoid compound run-ons.
- **Tone:** Opinionated, restrained, engineering-grounded. Speak from operational reality, not aspirational demos.
- **Underlining & Emphasis:** Use keyword emphasis sparingly. Restrict amber highlights to system names, invariants, and numbers.
- **Forbidden Vocabulary:** Never use hype adjectives (`revolutionary`, `cutting-edge`, `10x`, `disruptive`, `game-changing`, `magic`).
- **Claim Discipline:** Never state an empirical number without an adjoining `(src: …)` annotation.
- **Punctuation:** Prefer em-dashes `—` and middle dots `·` for inline separation; avoid rhetorical exclamation marks.
- **Capitalization:** Kicker commands use lowercase monospace (`$ whoami`); badges and status labels use uppercase.
- **Layout Alignment:** Maintain strict mathematical alignment across cards and tabular metrics to preserve the control-panel aesthetic.
