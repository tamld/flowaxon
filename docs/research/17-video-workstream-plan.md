# Video Workstream Plan (WV) — separated from the web MVP

**Principle (operator directive 2026-10-31)**: the web portfolio is the MVP and the critical path. Video production is a SEPARATE workstream with its own phases and deliverables. The site ships with placeholders/loops; full video lands when WV completes.

## WV phases (operator's six, mapped)

| Phase | Work | Owner | Status |
|---|---|---|---|
| **WV1 — Research** | Story outline, frame-by-frame script, number verification | coordinator (done: `16-explainer-en-script.md`; numbers need re-measure vs v0.21) | 80% — blocked on deep-dive duplication check + frame 3/7 source reconciliation |
| **WV2 — Film (script lock)** | Final EN script → operator's text→motion profile → raw render | operator (profile) | awaits WV1 sign-off |
| **WV3 — Visual build (dựng hình)** | Poster frames, 3× ≤5s loops (fan-out live in WF0; layer-cake; counters), end-card badge stills | coordinator pipeline (proven: 88KB/loop, 46KB poster) | pipeline ready; runs on WV2 output |
| **WV4 — Voice-over (lồng tiếng)** | Decide: EN VO recorded vs music-only + on-screen text. If VO: script narration lines are in `16-…md` (~300 words) | operator (voice) or music-only decision | OPEN decision |
| **WV5 — Sync (khớp hình)** | Profile re-render with locked timing; audio/video alignment; subtitle track (EN `.vtt`, opt-in) | operator profile + coordinator QC | after WV3/WV4 |
| **WV6 — Verification (kiểm định)** | Every number in the final cut re-measured against current g8s main (v0.21+) and linked in the site's source chips; DLP scan of every frame (no IPs/hostnames/CT IDs); referencability audit | coordinator (mechanical) | gate before publish |

## Hosting decision: Cloudflare R2 — YES (recommended)

Why R2 fits this exact project:
- **Zero egress fees** — the only major object store without per-GB egress; video is the one asset class where egress normally hurts.
- **Already in the family** — flowaxon.com runs on Cloudflare (DNS/WAF/CDN today). R2 attaches to the same account/zone: custom domain, cache rules, WAF, analytics in one place.
- **Free tier covers this scale**: 10 GB storage, Class-A/B ops free allowances — a 5.5MB explainer + loops + posters is noise.
- **Range requests supported natively** → video seeking works without a media server.
- **S3-compatible API** → CI/CD (Stage 6) can publish new renders with `rclone`/`aws-cli` the same way it ships the container.

Rejected alternatives (for the record): Cloudflare Stream (built for video, HLS/ABR — but paid per-minute and overkill for ≤3 clips; revisit if we ship a video library), YouTube unlisted (free embeds but third-party dependency, tracking, no control — against the self-host ethos), GitHub Releases (not a CDN, poor range behavior).

## Technical wiring (when WV completes)

1. R2 bucket `flowaxon-media` → custom domain **`media.flowaxon.com`** (same zone, cached at edge, `Cache-Control: public, max-age=31536000, immutable` on content-hashed filenames).
2. CSP update on the site: `media-src 'self' https://media.flowaxon.com` (and `img-src` for posters). One line in the Go server's header set — reviewed in a WF5 PR.
3. Site embeds: `<video poster>` lazy-loaded on click for the full explainer; ≤90KB loops autoplay muted inline (already proven in WF0).
4. **Media stays OUT of the git repo** — R2 is the single home for binaries; the repo stores URLs + hashes (keeps clone light and CI fast). WF3 wires the URLs.
5. DLP gate in WV6 applies to R2 objects too (public bucket).

## Immediate queue

- MVP path (web): WF0 review → WF1..WF5 — unchanged, critical path.
- WV: operator — (a) resolve intro/deep-dive duplication, (b) reconcile frame 3/7 source text, (c) pick WV4 mode (EN VO vs music-only). Coordinator resumes WV3 pipeline on the EN render.
