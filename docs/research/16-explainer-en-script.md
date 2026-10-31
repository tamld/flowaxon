# g8s Explainer — English Re-render Script (frame-by-frame)

**Purpose**: feed directly into the text→motion video profile as the EN source. Derived from the VI contact sheet (`~/Downloads/g8s-intro-contact-sheet.jpg`, 12 frames, 118s). Items marked `(reconstructed)` were partially legible on the storyboard and were rebuilt from g8s domain knowledge — verify against your original VN source script before rendering. On-screen text kept ≤ ~60 chars/line for 9:16 legibility. Keep the total runtime ~118s (≈9s per frame).

**Audio note**: the VI export carries an AAC track. If it is music-only, reuse it unchanged. If it contains VN narration, either (a) drop narration and let on-screen text carry it, or (b) record EN VO per the `narration` lines below (~2min, ~300 words).

---

### Frame 0 — 00:08.7 — THE PROBLEM
On-screen:
- kicker: `G8S · ZERO-TRUST GOVERNANCE`
- headline: `AN AI AGENT WITH EXECUTION POWER`
- sub: `...and no constraints`  (large, 87% ring fills behind)
Caption line: `power to execute. **no** boundaries.`
Narration: "An AI agent with real execution power — and nothing standing between it and your infrastructure."

### Frame 1 — 00:18.7 — THE TICKET STORM
On-screen:
- `190k tokens / budget burned`  (big counter)
- ticket list (mono): `implement auth.go · go test ./… · WireGuard tunnel · monitor · git diff · worker.go · simulate.json`
- agent mood chips: `runs blind` `can't verify` `bypasses gates`
Caption: `a queue of work. **zero** assurance.`
Narration: "Give it a budget and a task queue, and it will burn through both — blind."

### Frame 2 — 00:30.5 — THE CONTAINMENT STACK
On-screen (layer-cake animation, the signature visual):
- title: `THREE CONTAINMENT LAYERS`
- `F0 · ARCHITECT` — glue commits, human-confirmed
- `F1 · EXECUTOR` — task units claimed via CAS lease
- `F2 · SUBTASK` — runs inside an isolated sandbox
Caption: `F2 runs inside a **sandbox**, not your system.`
Narration: "g8s answers with containment: three layers — architect, executor, sandbox. Power stops where the layer ends."

### Frame 3 — 00:41.2 — ISOLATION BY THE NUMBERS
On-screen:
- gauges: `38% code outside the trusted core` · `15% surface reachable by F0`  (reconstructed — verify exact metrics against source)
- worktree stack diagram, one per worker
Caption: `but isolation only counts when it's **measured**.`
Narration: "Isolation isn't a promise — it's a measured number, per worker, per worktree."

### Frame 4 — 00:51.2 — THE DIFF-GUARD LOCK
On-screen (checklist stamps in):
- title: `DIFF-GUARD · THE LAST LOCK`
- ☑ every changed line reviewed, pre-mutation
- ☑ edits outside the WriteReceipt list — blocked
- ☑ overflow triggers an instant stop
Caption: `it stops **mid-run**, not post-mortem.`
Narration: "Diff-Guard reviews every changed line before it lands. Anything outside the receipt's path list dies instantly."

### Frame 5 — 01:04.4 — ORCHESTRATION FAN-OUT
On-screen (fan-out animation — this is the site's loop candidate):
- top: `F0 · ORCHESTRATOR`
- three workers: `go-core worker` · `unit-test worker` · `sim worker`
- queue bar: `F1 queue · in order`
Caption: `parallel work. **serial** authority.`
Narration: "The orchestrator fans work out — parallel execution, one line of authority, nothing skips the queue."

### Frame 6 — 01:15.2 — NO SELF-APPROVAL
On-screen (two-panel split):
- title: `NO SELF-APPROVAL. EVER.`
- left `AGENT F1`: works in a git worktree · runs local tests · produces execution evidence
- right `HUMAN (HITL)`: 12 critical gate decisions by hand · waits for your sign-off
Caption: `the machine does. the human **decides**.`
Narration: "The agent works, tests, and files evidence. The twelve critical gates stay human — by design, not by accident."

### Frame 7 — 01:28.8 — ADAPTIVE GOVERNANCE (SINE-WAVE)
On-screen:  (reconstructed — verify against source)
- title: `ADAPTIVE GOVERNANCE`
- left column `machine-managed`: standardized flows automated · inference throttled when unverified · no standard, no run
- right column `human-held`: novel task types · real-incident chains · high-blast-radius operations
Caption: `people handle the **exceptions**, machines the repeats.`
Narration: "Governance breathes: everything standardized goes to the machine; everything novel or dangerous comes back to you."

### Frame 8 — 01:38.3 — PROOF IN NUMBERS
On-screen (counters):
- `g8s v0.17 · PURE GO`
- `52` pure-Go core packages
- `>84%` automated test coverage (84.66%)
- `12` architectural verification gates
Caption: `measured **before** every claim.`
Narration: "Fifty-two pure-Go packages. Eighty-four percent test coverage. Twelve verification gates. Numbers, not adjectives."

### Frame 9 — 01:46.5 — ARCHITECTURE & ACCEPTANCE
On-screen:
- `F0 coordinates · architecture verified`  (progress ring to 45%→100%)
Caption: `from architecture to **acceptance**, end to end.`
Narration: "Architecture is not a diagram here — it's an accepted, verified artifact."

### Frame 10–11 — 01:56.5 — END CARD
On-screen:
- octagonal g8s badge (existing brand mark — reuse)
- title: `g8s · THE ZERO-TRUST GOVERNANCE BOUNDARY`
- pill: `explore & verify g8s`
- CTA: `experience g8s today — github.com/tamld/g8s`
Narration: "g8s — the zero-trust governance boundary. Explore and verify it today."

---

## Production notes

1. **Duplication check first**: `g8s-intro-9x16.mp4` and `g8s-deep-dive-9x16.mp4` are byte-identical (same for both `social` variants). If the deep-dive was meant to be a different cut, re-export it before the EN pass so the EN render covers both stories.
2. **Frame 3 metrics** (38% / 15%) and **Frame 7** copy are reconstructions from the storyboard — reconcile with the original VN script in the video profile.
3. **Numbers must stay referencable**: 52 packages / 84.66% / 12 gates should be re-verified against the current g8s main (v0.17 → v0.21 has likely moved them). The site will link each number; stale numbers in the video would violate the referencability rule — prefer re-measuring at render time.
4. **Web pipeline is ready**: 720p VP9 ~5.5MB full + ≤90KB 5s loops (poster 46KB) — EN render goes through the same pipeline (`assets/video/g8s-explainer/`), loop candidates: Frame 5 fan-out (live in WF0 already), Frame 2 layer-cake, Frame 8 counters.
