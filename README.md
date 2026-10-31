# FlowAxon (`tamld/flowaxon`) — AI Systems Engineering Dossier & Product Constellation

> Production multi-subdomain Go 1.22+ engine, interactive system anatomy rig, and machine-readable AI Agent / WebMCP endpoint deployed at **[https://flowaxon.com](https://flowaxon.com)**, **[https://g8s.flowaxon.com](https://g8s.flowaxon.com)**, and **[https://aegis.flowaxon.com](https://aegis.flowaxon.com)**.

## 🌐 Product Constellation Architecture

| Subdomain | Product Role | Target Personas | Key Interactive Capabilities |
| :--- | :--- | :--- | :--- |
| **[flowaxon.com](https://flowaxon.com)** | Executive Engineering Dossier & Ecosystem Hub (`index.html`) | CTOs / VPs of Engineering, Principal SREs, AI Agents (`llms.txt` / WebMCP) | 4-Layer Isometric System Anatomy Rig, Live SSE Telemetry Stream (`/api/events`), Interactive SRE Terminal & Dual-Plane Drill |
| **[g8s.flowaxon.com](https://g8s.flowaxon.com)** | `g8s (The Gatekeepers) v0.21.0` Developer Portal (`sites/g8s.html`) | AI Agent Builders, Platform Architects, Multi-Repo Maintainers | F0/F1/F2 × S0..S3 Orthogonal Stratum Firewall Playground (`/api/v1/g8s/verify-receipt`), 4-Tab CLI Lifecycle Explorer |
| **[aegis.flowaxon.com](https://aegis.flowaxon.com)** | `Aegis (defense-in-depth) v1.4.0` SecOps Portal (`sites/aegis.html`) | Autonomous SREs, SecOps Engineers, Compliance Auditors | Interactive Shell AST Risk Analyzer (`0..100` gauge, `/api/v1/aegis/analyze`) + Realistic Telegram Bot 2FA Approval Simulator |

## 🔒 Security & Hardening Standards
- **Zero-Trust CSP & Subresource Integrity (SRI)**: Strict `default-src 'self'; script-src 'self'; style-src 'self'` with SHA-384 integrity hashes on all CSS/JS assets (`A+` SecurityHeaders, `100%` Internet.nl Web).
- **Zero-Leakage DLP Gate (`.githooks/pre-commit`)**: 8 deterministic pre-commit gates enforcing Zero Gradient Law, Schema.org validity, SVG byte budgets (`<25KB`), and 100% OpSec sanitization.
- **Ultra-Lightweight Distroless Runtime (`Containerfile`)**: Static Go 1.22 binary (`CGO_ENABLED=0`) in `FROM scratch`, operating in `<1MB` RSS memory with Pull-GitOps deployment via `ghcr.io/tamld/flowaxon:latest`.

## 🧪 Local Verification
```bash
# Run unit & MIME/API regression tests
go test -v ./...

# Run 8-gate Zero-Leakage DLP & asset verification
bash .githooks/pre-commit
```

---
© 2026 Le Duc Tam (`tamld`).
