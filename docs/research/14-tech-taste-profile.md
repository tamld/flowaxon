# Operator Tech Taste Profile (FlowAxon v4 Analysis)

**Corpus Scope**: 1,146 starred repositories (aggregated October 2026)  
**Analysis Target**: Structural evolution, cluster taxonomy, taste signatures, and design sensibility.

---

## 1. Surfing Eras (2021 → 2026)

The temporal distribution and language breakdown reveal distinct evolutionary phases across the 6-year trajectory:

| Year | Total Stars | Primary Languages (Counts) | Era Designation | Key Structural Characteristic |
| :--- | :--- | :--- | :--- | :--- |
| **2021** | 3 | TypeScript (1), Swift (1) | *Initial Inception* | Sporadic early markers (2021-11: 2, 2021-12: 1). |
| **2022** | 183 | Python (27), C# (18), Go (17), PowerShell (13), JS (13), TS (10), C++ (8), Shell (5), Rust (2) | *Foundational CS & Infrastructure* | Heavy mid-year spike (2022-07: 97; 2022-06: 34); system building blocks, Windows administration (`PowerShell: 13`), OS tools. |
| **2023** | 186 | Shell (26), Go (25), Python (23), JS (16), C# (11), C++ (11), Rust (8), TS (8), Swift (6), PowerShell (4) | *Homelab & Automation Tooling* | Bimodal clustering in Spring (2023-04: 29, 2023-05: 42) and Autumn (2023-10: 24, 2023-11: 30); Unix scripting peak (`Shell: 26`). |
| **2024** | 106 | Python (16), Shell (15), Go (13), JS (10), TS (9), Rust (4), C# (2), Swift (2), C++ (1), PowerShell (1) | *Pragmatic Consolidation* | Slower accumulation rate (lows in 2024-03..06: 1–5/mo; moderate bump in 2024-10: 21); utility-driven curation. |
| **2025** | 456 | Python (105), TS (89), Go (60), Rust (23), Shell (23), JS (22), C++ (15), Swift (10), PowerShell (10), C# (8) | *Agentic Explosion & MCP Revolution* | Nearly 40% of all stars (456 / 1146 = 39.8%); explosive surges in 2025-02 (68), 2025-04 (77), 2025-05 (57), 2025-08 (64), 2025-09 (60). |
| **2026** | 212 | Python (58), TS (54), Rust (22), JS (20), Go (18), Shell (9), Swift (7), C# (1), C++ (1) | *Agent Harness, Skills & Autonomous Execution* | Sustained high throughput (2026-01 to 2026-05: 24–40/mo; 212 YTD); Rust overtakes Go (`Rust: 22` vs `Go: 18`). |

### The 2025 Explosion Broken Down

In 2025, star volume accelerated to 456 repositories, driven by concurrent systemic transitions captured in `topics_top40`:

```
2025 Star Wave Composition (456 repos):
├── Cluster A: Agent Architecture & Autonomy (ai: 114, ai-agents: 81, agent: 37, agents: 31, ai-agent: 20, agentic-ai: 16)
├── Cluster B: Tool Protocol & Claude Ecosystem (claude-code: 49, claude: 40, mcp: 26, anthropic: 21, codex: 21)
├── Cluster C: Containerization & Homelab Infra (docker: 68, linux: 46, devops: 26, docker-compose: 17, kubernetes: 17, ansible: 19)
├── Cluster D: Cross-Platform CLI & OS Ops (cli: 50, macos: 42, windows: 30, bash: 30, command-line: 22, proxy: 16)
└── Cluster E: Curated Knowledge & Hackathons (awesome: 65, awesome-list: 59, hacktoberfest: 53)
```

1. **AI Agents & Model Context Protocol Transition**: Python (`105`) and TypeScript (`89`) surged simultaneously as LLM agents shifted from single prompt wrappers to multi-agent harnesses and tools (`mcp: 26`, `claude: 40`, `claude-code: 49`).
2. **Infrastructure Grounding**: Despite the AI boom, systems engineering remained bedrock: `docker` (`68`), `linux` (`46`), `devops` (`26`), and `golang` (`36`/`go: 25` with `Go: 60` repos in 2025). The operator was containerizing agents and building self-hosted networks, not merely running browser tabs.
3. **Cross-Platform OS Tuning**: The operator actively curated workflows spanning Unix and Windows (`macos: 42`, `windows: 30`, `bash: 30`, `PowerShell: 10`), bridging desktop scripting with network proxies (`proxy: 16`).

---

## 2. Cluster Taxonomy

From `topics_top40`, `mainstream_top25`, `niche_focus_candidates`, and `awesome_sample`, the 1,146 repos organize into 10 cohesive clusters:

| # | Cluster Name | Est. Size (% / Repos)* | Exemplars (3 from Packet) | Cluster Identity |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Coding Agents & Autonomous Harnesses** | ~22% (250 repos) | `openclaw/openclaw` (*393k), `anomalyco/opencode` (*223k), `Significant-Gravitas/AutoGPT` (*187k) | Core agent runtimes executing coding and autonomous actions across operating systems. |
| **2** | **Agent Skills, Instincts & Context Frameworks** | ~14% (160 repos) | `obra/superpowers` (*309k), `mattpocock/skills` (*307k), `affaan-m/ECC` (*293k) | Modular capabilities, `.agents` skill definitions, and behavioral steering for LLMs. |
| **3** | **Model Context Protocol (MCP) & Agent Connectivity** | ~8% (90 repos) | `NapthaAI/automcp` (*301), `mrgoonie/human-mcp` (*292), `AmoyLab/Unla` (*2.2k) | Standardized tool servers, gateways, and bridges linking AI models to real-world APIs and human workflows. |
| **4** | **Homelab Virtualization & Bare-Metal Proxmox** | ~9% (100 repos) | `tamld/homelab-proxmox` (*1), `sitrox/proxmox-utils` (*61), `TheRealAlexV/proxmox-vzbackup-rclone` (*273) | Hypervisor automation, backup pipelines, LXC/VM orchestration, and private host infrastructure. |
| **5** | **Edge Networking, Tunnels & Proxy Operations** | ~7% (80 repos) | `zenkiet/traefik-tunnel-expose` (*206), `alphacodinghub/v2ray-nginx-docker` (*48), `jason5ng32/MyIP` (*12k) | Ingress routing, Cloudflare tunnels, encrypted proxies, WebRTC/DNS leak verification, and perimeter control. |
| **6** | **Container DevOps & Infrastructure as Code** | ~11% (125 repos) | `TheGameProfi/terraform-provider-proxmox` (*32), `shuaibiyy/awesome-tf` (*6.6k), `n8n-io/n8n` (*209k) | Declarative provisioning (Terraform/OpenTofu), Docker Compose microservices, and workflow automation. |
| **7** | **Terminal Power Tools & Shell Customization** | ~9% (100 repos) | `ohmyzsh/ohmyzsh` (*190k), `yt-dlp/yt-dlp` (*204k), `trimstray/the-book-of-secret-knowledge` (*254k) | High-leverage command-line downloaders, zsh configurations, cheatsheets, and one-liner toolkits. |
| **8** | **Defensive SecOps & Threat Simulation** | ~5% (60 repos) | `Patrowl/PatrowlManager` (*638), `meirwah/awesome-incident-response` (*9.5k), `paralax/awesome-honeypots` (*10.6k) | Incident response runbooks, security orchestration, deception honeypots, and threat intelligence. |
| **9** | **Foundational CS Pedagogy & Engineering Primers** | ~8% (90 repos) | `codecrafters-io/build-your-own-x` (*557k), `donnemartin/system-design-primer` (*376k), `ossu/computer-science` (*210k) | Rigorous first-principles reference curricula, system architecture blueprints, and recreate-from-scratch manuals. |
| **10** | **Agent-Native Workspace & Repo-Spec Documentation** | ~7% (80 repos) | `knowns-dev/knowns` (*250), `microsoft/markitdown` (*193k), `firecrawl/firecrawl` (*197k) | Markdown-first engineering specs, web scrapers for LLM context, and living documentation for autonomous dev agents. |

*\*Size estimates derived via proportional topic co-occurrence mapping (`topics_top40`) normalized to 1,146 total repos (inference).*

---

## 3. Taste Signature (Evidence-Backed Statements)

### Statement 1: Extreme Bimodal Stratification — Blue-Chip Reference Compendiums vs. Micro-Utility Pins
* **Statement**: The operator's library is sharply bimodal: either hyper-popular reference canons (>150k stars) or sub-600-star surgical utilities solving hyper-specific homelab/agent problems.
* **Evidence**:
  * Mainstream top 25 contains massive landmarks: `codecrafters-io/build-your-own-x` (*557,793), `sindresorhus/awesome` (*527,789), `EbookFoundation/free-programming-books` (*400,596), `donnemartin/system-design-primer` (*376,297).
  * Conversely, the niche set contains hyper-targeted pins: `tamld/homelab-proxmox` (*1), `frostyfab/terraform-provider-proxmox` (*1), `TheGameProfi/terraform-provider-proxmox` (*32), `alphacodinghub/v2ray-nginx-docker` (*48), `sitrox/proxmox-utils` (*61), `TheRealAlexV/proxmox-vzbackup-rclone` (*273), `mrgoonie/human-mcp` (*292), and `NapthaAI/automcp` (*301).
  * *Interpretation*: Mega-stars are used as encyclopedic bookmarks; niche repos are operational tools plugged directly into active machines.

### Statement 2: Awesome-List Dependency — Structured Cataloging as a Retrieval Index, Not Passive Collection
* **Statement**: The operator treats "awesome-*" lists not as indiscriminate star-collecting, but as targeted taxonomy hubs for domain boot-strapping.
* **Evidence**:
  * Top topics include `awesome` (65) and `awesome-list` (59).
  * Examination of `awesome_sample` shows domain-specific functional indexes:
    * Agent skills: `VoltAgent/awesome-claude-code-subagents` (*26,229), `VoltAgent/awesome-openclaw-skills` (*53,462), `sickn33/agentic-awesome-skills` (*48,886), `ComposioHQ/awesome-claude-skills` (*78,403).
    * Systems/Ops: `shuaibiyy/awesome-tf` (*6,668), `enescingoz/awesome-n8n-templates` (*26,198), `mfornos/awesome-microservices` (*14,559).
    * Security: `meirwah/awesome-incident-response` (*9,514), `paralax/awesome-honeypots` (*10,640), `lissy93/awesome-privacy` (*10,031).
  * The operator leverages curated indexes to track the high-velocity explosion of agent skills without bookmarking thousands of individual repositories.

### Statement 3: Go's Strategic Position — The Reliable Systems Workhorse Amidst Polyglot Shifts
* **Statement**: While Python and TypeScript dominate raw volume in the AI era, Go occupies a stable, non-discretionary role as the production backend and systems plumbing language.
* **Evidence**:
  * From `year_x_lang["Go"]`: 2022 (17) → 2023 (25) → 2024 (13) → 2025 (60) → 2026 (18). Total Go stars = 133.
  * Topics confirm this steady footprint: `golang` (36), `go` (25).
  * Go projects in the packet are pure infrastructure: `TheGameProfi/terraform-provider-proxmox` (*32) and `knowns-dev/knowns` (*250) (specs/tasks for AI coding agents).
  * Even as Rust gained ground in 2025–2026 (`Rust: 23` in 2025, `22` in 2026), Go peaked at 60 in 2025, serving as the language of operational networking, proxies, Docker engines, and daemon runners.

### Statement 4: The Agentic Transition — From Autonomous Toy Agents (2025) to Mechanical Skills & Harnesses (2026)
* **Statement**: The operator's agent interests matured rapidly from open-ended autonomous agent frameworks toward structured skill harnesses, steering files, and protocol adapters.
* **Evidence**:
  * 2025 agent stars: `Significant-Gravitas/AutoGPT` (*187k, starred 2025-12-07), `firecrawl/firecrawl` (*197k, starred 2025-04-17), `NapthaAI/automcp` (*301, starred 2025-04-28).
  * 2026 agent stars shift toward harness engineering and explicit skills: `openclaw/openclaw` (*393k, 2026-01-13), `obra/superpowers` (*309k, 2026-01-17), `affaan-m/ECC` (*293k, 2026-03-03), `mattpocock/skills` (*307k, 2026-05-16), `multica-ai/andrej-karpathy-skills` (*227k, 2026-04-10 - single `CLAUDE.md`), `ultraworkers/claw-code` (*194k, 2026-04-01 - built in Rust with LazyCodex).
  * Specific topic counts: `claude-code` (49), `claude` (40), `agent-skills` (19), `codex` (21), `mcp` (26).

### Statement 5: Pragmatic Bare-Metal Homelabber Behind the Cloud/AI Persona
* **Statement**: The operator maintains hands-on home virtualization infrastructure, personally configuring low-level Proxmox VE environments and secure gateway tunnels.
* **Evidence**:
  * Direct repository presence: `tamld/homelab-proxmox` (*1, Shell, 2025-04-12), authored/starred as personal homelab settings.
  * Companion ecosystem pins: `TheRealAlexV/proxmox-vzbackup-rclone` (*273), `UntouchedWagons/Ubuntu-CloudInit-Docs` (*555), `sitrox/proxmox-utils` (*61), `roib20/proxmox-scripts` (*65), `zenkiet/traefik-tunnel-expose` (*206).
  * *Interpretation*: The operator does not simply consume cloud SaaS; they self-host, automate hypervisors, and route their own tunnels.

### Statement 6: Text-Centric Markdown-as-State Philosophy
* **Statement**: The operator prioritizes plain text, Markdown specs, and terminal documentation over complex graphical interfaces or proprietary formats.
* **Evidence**:
  * In mainstream top stars: `codecrafters-io/build-your-own-x` (Markdown), `microsoft/markitdown` (*193k, Python tool for converting files/office docs to Markdown), `DigitalPlatDev/FreeDomain` (Markdown).
  * In niche and awesome lists: `knowns-dev/knowns` ("Tasks, docs, specs and decisions for AI coding agents, as markdown in your repo"), `VoltAgent/awesome-design-md` (*124k, "collection of DESIGN.md files"), `multica-ai/andrej-karpathy-skills` ("A single CLAUDE.md file").
  * This matches top CLI topics: `cli` (50), `command-line` (22), `bash` (30).

---

## 4. Design-Sensibility Inference

*(Labeled as Inference)*

Based on the empirical taste signature—marked by heavy concentration in terminal utilities (`cli: 50`, `bash: 30`, `Shell: 74` total), infrastructure hypervisors (`Proxmox`, `Docker: 68`, `Traefik`), plain-text state engines (`knowns-dev/knowns`, `CLAUDE.md`, `DESIGN.md`), and systems languages (Go, Rust, Python, C/C++)—the aesthetic that conclusively fits the operator is **Terminal / Blueprint**.

The operator demonstrates near-zero affinity for whimsical, playful-graphical, or consumer-candy interfaces; instead, their starred collection highlights dense information architecture, monospace readability, transparent wiring diagrams, and functional minimalism. Even when evaluating design systems (e.g., `VoltAgent/awesome-design-md`), the asset chosen is a plain-text markdown specification rather than a Figma UI kit. Their mental model treats user interfaces as structured diagnostic dashboards and terminal control surfaces—clean lines, high contrast, state-transparent status indicators, and deterministic inputs that mirror an engineer inspecting live system telemetry or a Proxmox cluster console.
