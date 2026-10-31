# Narrative & Content Strategy

## 1. Story audit
- Site says: generic tech-demo storytelling about machines and features F-01..F-12.
- Real work: builds AI orchestration harness (multi‑agent coordinator/worker architecture with containment tiers, write receipts, zero‑trust gates), runs homelab‑to‑production fleet (Proxmox CTs, podman, Traefik), practices DevSecOps governance (6‑stage zero‑trust CI/CD, SLSA provenance).
- Gap: narrative hides identity and impact. Evidence: manifest.json sections protagonist_and_storytelling generic, feature_map enumerates F-01..F-12, constellation_domains abstract.
- Next step: rewrite protagonist_and_storytelling to reflect real roles.

## 2. Three positioning statements
- **Position 1 (AI factory)**
  - Statement: I build AI factories that coordinate agents with containment tiers and receipts.
  - Paragraph: I design multi‑agent coordinator/worker architecture with containment tiers, write receipts, enforce zero‑trust gates.
  - Audience: AI/infra teams
  - Risk: May obscure hands‑on ops
- **Position 2 (systems operator)**
  - Statement: I operate full‑stack homelab‑to‑production with Proxmox CTs, podman, Traefik.
  - Paragraph: I manage Proxmox CTs, containerize workloads with podman, route traffic via Traefik.
  - Audience: Ops/devops
  - Risk: May appear niche
- **Position 3 (trust engineer)**
  - Statement: I engineer zero‑trust gates and SLSA provenance for CI/CD pipelines.
  - Paragraph: I enforce six‑stage zero‑trust CI/CD, embed SLSA provenance, audit every gate.
  - Audience: Security/compliance
  - Risk: May seem abstract
- **Position 4 (containment ecosystem)** – alternative
  - Statement: I design containment‑aware agent ecosystems for mission‑critical workloads.
  - Paragraph: I align agent scopes with workload sensitivity, enforce tiered isolation.
  - Audience: Enterprise AI teams
  - Risk: May confuse non‑technical stakeholders

## 3. Site map
### Home
- Purpose: introduce owner and core value.
- Primary proof: positioning statement headline + screenshot of orchestration diagram.
- Dies: 3D machines, F-01..F-12 map.

### AI Orchestration
- Purpose: showcase AI factory architecture.
- Primary proof: diagram of coordinator/worker tiers, receipts, zero‑trust gate.
- Dies: feature_map F-01..F-12, constellation_domains.

### Infrastructure Ops
- Purpose: illustrate homelab‑to‑production workflow.
- Primary proof: Proxmox CT layout, podman containers, Traefik config.
- Dies: 3D machines.

### Trust & Security
- Purpose: expose zero‑trust governance and SLSA provenance.
- Primary proof: CI/CD pipeline stages, provenance statements.
- Dies: constellation_domains.

### Projects
- Purpose: present selected case studies.
- Primary proof: demo videos, repo links.
- Dies: F-01..F-12.

### Research
- Purpose: share narrative research and strategy.
- Primary proof: this document and underlying assets.
- Dies: none.

### Contact
- Purpose: enable collaboration inquiries.
- Primary proof: email, GitHub, LinkedIn.
- Dies: none.

## 4. Homepage narrative arc
### Hero
- Variant A: “I build AI factories that coordinate agents with containment tiers and receipts.”
  Sub‑line: “Proof: zero‑trust gates and SLSA provenance.”
- Variant B: “I operate full‑stack homelab‑to‑production with Proxmox CTs, podman, Traefik.”
  Sub‑line: “Proof: 6‑stage zero‑trust CI/CD.”
- Variant C: “I engineer zero‑trust gates and SLSA provenance for CI/CD pipelines.”
  Sub‑line: “Proof: write receipts and containment tiers.”

### Proof
- bullet: positioning statement headline + artifact screenshot.

### Depth
- bullet: pages (AI Orchestration, Infrastructure Ops, Trust & Security, Projects, Research).

### Contact
- bullet: email, GitHub, LinkedIn.

## 5. Language policy recommendation
- Option 1: English-only
  - Rationale: international open‑source credibility.
  - Cost: static file addition zero.
- Option 2: Vietnamese-only
  - Rationale: local audience reach.
  - Cost: rewrite existing content.
- Option 3: Bilingual (English lead)
  - Rationale: serve both markets, maintain one code base.
  - Architecture: English primary page, Vietnamese page at /vi/ with same layout.
  - Cost: duplicate assets, extra routing.

## 6. Content repurposing map
| Existing Asset | New Role | Notes |
|---|---|---|
| manifest.json | reposition protagonist_and_storytelling (rewrite) | keep JSON schema |
| README.md | executive summary (rewrite) | condense project description |
| llms.txt | AI orchestration description (reuse) | keep as reference |
| llms-full.txt | detailed self‑description (reuse) | keep full bio |
| docs/research/02-ba-user-journey-and-storytelling.md | research draft (rewrite) | incorporate findings |
| index.html headings | section titles (reuse) | map headings |
| feature_map (F-01..F-12) | slim data model (delete) | remove |
| 3D machines assets | removed (delete) | discard |
| constellation_domains framing | high‑level domain taxonomy (rewrite) | simplify |

## 7. Ten headline/subhead pairs
1. **Headline:** AI factory orchestrates multi‑agent workloads  
   **Subhead:** Containment tiers, receipts, zero‑trust gates proven in 6‑stage CI/CD.
2. **Headline:** Homelab scales to production with Proxmox CTs and podman  
   **Subhead:** Traefik bridges containers, SLSA provenance tracks every build.
3. **Headline:** Zero‑trust gates enforce least‑privilege access  
   **Subhead:** Each gate logged, receipts stored, audit ready.
4. **Headline:** Multi‑agent coordinator/worker architecture with containment  
   **Subhead:** Agent scopes aligned to workload sensitivity.
5. **Headline:** Proxmox CTs host container workloads at scale  
   **Subhead:** Podman runtime, Traefik ingress, automated provisioning.
6. **Headline:** SLSA provenance guarantees build integrity  
   **Subhead:** Every artifact signed, verified, traceable.
7. **Headline:** Six‑stage CI/CD pipeline with zero‑trust gates  
   **Subhead:** Security embedded at each stage, no blind spots.
8. **Headline:** Containment tiers isolate agent failures  
   **Subhead:** Fault containment prevents cascade, receipts record events.
9. **Headline:** Write receipts for every orchestration step  
   **Subhead:** Audit trail immutable, SLSA compliant.
10. **Headline:** DevSecOps governance across homelab and cloud  
    **Subhead:** Unified policies, automated compliance, zero‑trust everywhere.
