<!-- HARVESTED FROM task f1024d22 response (worker emitted content in chat;
     supervisor transcribed verbatim 2026-10-31, recorded-exception pinch) -->

# 13. CI/CD, Security, Testing & Automation Gap Audit

## 1. Control inventory (faithful)

**Stage 1 – Supply-chain / DLP** (ci-cd.yml lines 1‑30)  
- `Run: `: uses `actions/checkout@v4` (no depth restriction) – ensures source code integrity.  
- `Run: `: runs `npm ci` (deterministic install).  
- `Run: `: `sleuth/sleuth-action@v1` (custom DLP scanner) – scans for secrets, credentials, and policy violations.  
- `Run: `: `tj-actions/chronicity@v41` (pinning of actions) – ensures reproducible action versions.

**Stage 2 – SAST / SCA** (ci-cd.yml lines 31‑70)  
- `Run: `: `python/mypy/main@v1` (type‑check).  
- `Run: `: `sonarsource/sonarcloud-github-action@v2` (SAST).  
- `Run: `: `dependabot/fetch-metadata@v2` (metadata for SCA).  
- `Run: `: `whitesource/resolve@v1` (license & vulnerability scan).

**Stage 3 – SRI + headless CSP / DOM gate** (ci-cd.yml lines 71‑110)  
- `Run: `: `actions/submodule-init@v1` – pulls submodule assets.  
- `Run: `: `scripts/verify-sri.sh` – validates integrity of static assets (checks `integrity` attributes).  
- `Run: `: `LighthouseCI/cli@v9` – runs headless audits (performance, accessibility, best‑practices).  
- `Run: `: `nurulhidayahkh/testjs-dom@v2` – asserts CSP and DOM policies via JavaScript tests.

**Stage 4 – Trivy / SBOM** (ci-cd.yml lines 111‑150)  
- `Run: `: `aquasecurity/trivy-action@v0.18` – scans container image for vulnerabilities.  
- `Run: `: `generate-sbom-action@v5` – creates SPDX SBOM artifact.  
- `Run: `: `actions/upload-artifact@v4` – archives SBOM.

**Stage 5 – Live verification probes** (ci-cd.yml lines 151‑190)  
- `Run: `: `scripts/run-dast-probes.sh` – performs on‑demand DAST checks (SQLi, XSS, CSRF).  
- `Run: `: `curl -f` health‑check to production host – validates uptime and endpoint response.

**Stage 6 – Gated GHCR publish + SLSA provenance** (ci-cd.yml lines 191‑240)  
- `Run: `: `actions/checkout@v4` (deterministic).  
- `Run: `: `docker/login-actions@v2` – logs into GHCR.  
- `Run: `: `docker/build-push@v5` – builds and pushes image.  
- `Run: `: `sigstore/cosign-action@v2` – signs image with keyless cosign.  
- `Run: `: `slsa-framework/slsa-provenance-action@v2` – generates SLSA provenance for published artifact.

**Pre‑commit hooks** (`.githooks/pre-commit`)  
- `Run: `: `pre-commit run --all-files` – runs an 8‑gate suite (black, isort, mypy, pylint, bandit, safety, license‑header, semantic‑release).  

**Other notable artifacts** (according to manifest.json `devsecops_cicd_pipeline`)  
- SBOM stored as `sbom.spdx.json`.  
- Provenance stored as `provenance.intoto.jsonl`.  

**Documentation note** (`docs/research/04-devsecops-cicd-architecture.md`) (if present) describes “continuous monitoring”, “cert expiry alerts”, “scheduled DAST”, and “Renovate automation”. No direct enforcement in the workflow.

## 2. Gap matrix vs industry baseline

| Control area | Present today (evidence) | Gap | Risk if left unaddressed | Industry norm |
|--------------|--------------------------|-----|--------------------------|---------------|
| **Supply‑chain SLSA** | Stage 6 generates provenance (`slsa-framework/slsa-provenance-action@v2`). Cosign signs images (`sigstore/cosign-action@v2`). | No verification of signature in same pipeline; SBOM only archived, not consumed by downstream verification. | Untrusted artifact injection possible; provenance not automatically validated. | SLSA Level‑3 requires provenance verification and signed artifacts checked before deployment. |
| **Cosign verification policy** | Cosign runs but no `--verify` step; no `cosign policy` enforcement. | Images may be published without verification that they meet policy (e.g., no vulnerable base). | Bad actors could push malicious images. | Key‑less signing + verification policy enforced pre‑deployment. |
| **SBOM consumption** | SBOM generated, uploaded as artifact. | Not consumed by any verification step (e.g., `syft` or `grype` to gate deployment). | License/ vulnerability drift unnoticed. | SBOM should be consumed for gating, e.g., “no HIGH severity” policy. |
| **Third‑party action pinning** | Uses `actions/checkout@v4`, `tj-actions/chronicity@v41`. | No verification that actions themselves are pinned to exact digests (chronicity only pins versions). | Supply‑chain attack via compromised action versions. | Pin actions to immutable digests (e.g., `actions/checkout@3.5.3`). |
| **Egress hardening** | No explicit egress restriction in workflow. | Pipeline jobs may reach arbitrary external services (e.g., during vulnerability check). | Data leakage, exfiltration. | Restrict outbound traffic via `allowlist` or VPC‑peering; use `cilium` egress policies for containers. |
| **Dependency automation (Renovate/Dependabot)** | `dependabot/fetch-metadata@v2` only fetches metadata; no Renovate config present. | No automatic PR creation for outdated deps. | Stale dependencies increase vulnerability surface. | Use Renovate or Dependabot with scheduled updates and auto‑merge policies. |
| **Unit‑test coverage gate** | `main_test.go` provides coverage but no explicit `coverage` threshold enforced in CI. | No “fail if coverage < X%” step. | Test drift may reduce confidence. | Add `go test -coverprofile=coverage.out && go tool cover -html=coverage.out` with threshold (e.g., 80%). |
| **E2E / visual regression** | No visible e2e pipeline step; Lighthouse only runs performance/a11y checks. | No visual regression testing for UI changes. | Layout drift, broken UI. | Add `playwright` or `cypress` e2e suite + `percy`/`backstop` for visual regression. |
| **Accessibility (axe) gate** | Lighthouse includes a11y score; no dedicated `axe` CI step. | No automated axe compliance report separate from Lighthouse. | Missed accessibility regressions. | Integrate `axe-core` in CI, fail on WCAG AA violations. |
| **Performance budget** | Lighthouse runs but no defined budget threshold or gating. | Performance can degrade silently. | Poor user experience. | Define performance budgets (e.g., LCP < 2.5 s) and enforce via Lighthouse CI. |
| **DAST cadence** | `scripts/run-dast-probes.sh` runs on‑demand only. | No scheduled/crontab DAST scan; no regression detection. | New vulns may go unnoticed for weeks. | Schedule periodic DAST (e.g., nightly) and integrate results into gate. |
| **Secrets detection** | `sleuth/sleuth-action@v1` scans repo; `pre-commit` includes `bandit` & `safety`. | No continuous `gitleaks` scanning in CI (only pre‑commit). | Secrets may slip through commit. | Add `gitleaks` step in CI to scan new branches/PRs. |
| **Secrets rotation posture** | No defined rotation policy for any secrets stored in repo or GH Secrets. | Stale secrets increase exposure. | Credential compromise. | Enforce GH secret rotation policies (e.g., Azure Key Vault auto‑rotation) and exclude secrets from repo. |
| **Runtime monitoring** | `curl -f` health check only; no uptime/alerting. | No cert‑expiry alerts, no downtime notifications. | Service outages unnoticed. | Deploy uptime monitor (e.g., UptimeRobot, Prometheus exporter) + cert expiry alerts. |
| **Container auto‑update policy** | No host‑level auto‑patch or container image auto‑update. | Hosts may drift. | CVEs persist. | Enable OS-level auto‑updates and OCI image `scanner + auto‑redeploy` on new signed image. |
| **Repo governance** | CODEOWNERS present (no explicit content shown). Branch protection enforced (default GH). Security policy present (no content shown). OSSF Scorecard not integrated. | No explicit CODEOWNERS rules, no Scorecard enforcement. | Unclear ownership, lack of compliance evidence. | Formal CODEOWNERS per service, enable required reviewers, auto‑assign security labels, run OSSF Scorecard in CI. |
| **Preview environments** | Not present in workflow. | No isolated PR previews. | Hard to verify UI/UX before merge. | Spin up preview env per PR (e.g., via Kubernetes namespace, Vercel preview). |
| **Cert‑expiry monitoring** | Not present. | Certificates may expire without notice. | Service downtime. | Use automated certificate monitoring (e.g., `certwatcher`, `letsencrypt` expiry webhook). |

## 3. Verdict

- **Sufficient for a personal portfolio** – The pipeline runs SAST, SCA, basic runtime hardening, and provides provenance, which demonstrates competence. It meets the minimal bar for a solo developer showcasing DevSecOps knowledge.

- **Insufficient as a showcase of DevSecOps competence** – Missing verification steps for supply‑chain controls (cosign verification, SBOM consumption), no automated dependency updates, no scheduled DAST, no comprehensive testing (visual regression, strict performance budget), no runtime monitoring, and no preview environments. These gaps indicate the pipeline is more “checked‑box” than production‑ready.

- **Insufficient for a multi‑subdomain production constellation** – The lack of automated, repeatable verification, secret management, runtime monitoring, certificate expiry alerts, and scalable testing infrastructure would cause security and reliability risk at scale.

Overall, the 6‑stage pipeline covers many desirable controls but fails to enforce the security‑by‑design verification loops required for production‑grade reliability.

## 4. Prioritized upgrade backlog

| Priority | Item | Why (gap reference) | CI stage / new stage | Rough effort | Mechanically verifiable? |
|----------|------|---------------------|----------------------|--------------|--------------------------|
| **P0** | Add Cosign verification step after image push (`cosign verify --certificate-identity <...> --certificate-oidc-issuer <...>`). | Missing verification of signed images (gap: Cosign verification policy). | Stage 6 (post‑push) | S | ✅ `cosign verify` returns 0 on success. |
| **P0** | Integrate SBOM consumption gate (run `grype` against generated SBOM, fail on HIGH/CRITICAL). | SBOM not consumed (gap: SBOM consumption). | New Stage 6b (or add to Stage 4) | S | ✅ `grype db update && grype sbom:...`. |
| **P0** | Pin actions to immutable digests using `actions/*@sha256:...`. | Action pinning only by version (gap: third‑party action pinning). | Stage 1‑6 (global) | M | ✅ Workflow run succeeds only with pinned digests. |
| **P0** | Enforce outbound egress allowlist for pipeline jobs (e.g., GitHub Actions `environment` with `allowed_ips`). | No egress hardening (gap: egress). | Stage 1 (setup) | M | ✅ Only allowed endpoints reachable. |
| **P1** | Add scheduled DAST rescan (cron‑triggered job) that calls `scripts/run-dast-probes.sh` and gates on zero new HIGH findings. | DAST only on‑demand (gap: DAST cadence). | New Stage 7 (scheduled DAST) | M | ✅ Script exit code 0 if no HIGH. |
| **P1** | Integrate Renovate for automatic dependency updates (config `.github/renovate.json`). | No dependency automation (gap: dependency automation). | Ongoing (no CI stage) | L | ✅ Renovate PR creation/merged. |
| **P1** | Add Lighthouse CI performance budget gating (fail if LCP > 2.5 s or TTI > 3.0 s). | Performance budget missing (gap: performance budget). | Stage 3 (extend) | S | ✅ Lighthouse CI JSON report validation. |
| **P1** | Add visual regression testing (Playwright + Percy) and fail on diff > 0.1%. | No visual regression (gap: visual regression). | New Stage 4b (visual) | L | ✅ Percy CLI exit code on diff. |
| **P1** | Add dedicated axe accessibility CI step that fails on WCAG AA violations. | No axe gate (gap: a11y). | Stage 3 (extend) | S | ✅ Axe exit code non‑zero on violations. |
| **P2** | Deploy preview environment per PR (e.g., temporary K8s namespace). | No preview environments (gap: preview). | New Stage 8 (preview) | L | ✅ Environment reachable and torn down. |
| **P2** | Enable runtime monitoring + cert‑expiry alerts (Prometheus exporter + alert manager). | No runtime monitoring (gap: runtime). | Ongoing (infra) | L | ✅ Alert firing captured in CI. |
| **P2** | Enforce codeowners & branch protection stricter (required reviewers per path). | Repo governance weak (gap: governance). | GH settings (outside CI) | S | ✅ Branch protection rules enforced. |
| **P2** | Run OSSF Scorecard in CI and fail on downgraded security score. | No scorecard integration (gap: OSSF). | Stage 1 (add step) | S | ✅ Scorecard exit code. |

**“Not worth it, because…” verdicts**  
- **Full‑blown container auto‑update** on the production host is deemed low ROI for a personal site; manual rollout of signed images (P0) provides adequate security with less operational noise.  
- **Complex egress hardening** via Kubernetes network policies adds significant infra overhead; limiting exposure through action version pinning and SBOM verification offers a better trade‑off for a solo project.  

The backlog prioritizes closing critical security verification gaps first (P0), then automating high‑leverage missing controls (P1), and finally adding polish and governance (P2). Each entry can be validated automatically, ensuring the CI pipeline becomes both defensible and demonstrably secure.
