# Canvas Layer Spec — compositing architecture for WV (video) and WF (site)

**Operator directive**: "cách ta dựng nội dung, kịch bản, hình ảnh, các lớp hình ảnh nằm đè lên nhau, tương tác với nhau" — good canvas → good effects. This spec defines the layer stack ONCE; every scene (video frame or site section) is a configuration of layers, never a bespoke drawing. Same philosophy as g8s: top-down structure first, then lateral instances.

## The layer stack

```text
L5  HUMAN LAYER      sign-off beats — frame dims, a human decision lands
L4  MOTION LAYER     task dots, packet flows, seal stamps (deterministic paths only)
L3  NARRATIVE LAYER  headlines + caption lines (one thought per frame, 1 keyword)
L2  EVIDENCE LAYER   counters, gauges, receipt stamps, CI chips + source micro-labels
L1  STRUCTURE LAYER  F0/F1/F2 rings, pipeline stages, connection paths (the spine)
L0  DEEP CANVAS      blueprint grid + OKLCH atmosphere (dark #0a0e14, amber accents)
```

## Composition rules (the "tương tác" contract)

1. **Overlap budget**: L0 is always on; **max 2 more layers visible** per beat. Three layers competing = noise; the viewer reads one layer at a time.
2. **Causality rule**: motion in L4 must be *caused* by an L1/L2 event (a dot flies because a lease was claimed; a seal stamps because a receipt was earned). No ambient randomness — the film must obey the same determinism thesis as the product it explains.
3. **Continuity rule**: scene transitions travel ALONG the L1 structure (camera dollies down the containment stack, slides along the pipeline) — never teleport between unrelated diagrams. The viewer always knows where they are in the architecture.
4. **Color ownership**: each act owns a hue (Act I rust `#e07850` · Act II steel `#6f8fb8` · Act III amber `#f0a832` — already in WF0 v2). L0/L1 inherit the act hue at low saturation; **amber is reserved for proof/authority moments** (receipts, gates, verified numbers).
5. **The human pause (L5 signature)**: at every HITL gate, all layers dim except L3, and a sign-off mark lands with a single tick sound. 12 gates = 12 visual pauses — the audience *feels* "human decides" in rhythm, not in words.
6. **Text pattern (carried from the VI v1 — it worked)**: caption = one sentence with exactly one underlined keyword; the keyword is the narration beat. L3 never shows more than 2 lines.
7. **Evidence carries sources**: L2 numbers render with a micro-label (run #, repo, "measured 2026-10-31") — referencability rule applies inside the video, not just the site.

## Scene → layer configuration map (12 frames)

| Frame | Beat | Layers on | Motion (L4) |
|---|---|---|---|
| 0 | unconstrained agent | L0+L2+L3 | 87% ring fills red-ish (rust) |
| 1 | token storm | L0+L2+L3 | ticket lines stack, counter spins |
| 2 | containment stack | L0+L1+L3 | camera dollies DOWN the F0/F1/F2 cake |
| 3 | measured isolation | L0+L1+L2 | worktrees stack, gauges draw on |
| 4 | Diff-Guard | L0+L2+L3 | checklist ticks; blocked line strikes red |
| 5 | fan-out | L0+L1+L4 | dots fly F0→workers (loop candidate) |
| 6 | no self-approval | L0+L3+**L5** | first HUMAN PAUSE — split panel, sign-off tick |
| 7 | adaptive governance | L0+L1+L3 | sine-wave sweeps, machine/human columns alternate |
| 8 | proof numbers | L0+L2+L3 | counters count, micro-sources fade in (amber) |
| 9 | acceptance | L0+L1+L2 | ring completes to 100% |
| 10–11 | end card | L0+L3 | badge assembles from layer ghosts |

## Dual-channel audio (WV4 ratified)

- **Voice-over (EN)**: narration lines in `16-explainer-en-script.md`; VO carries the story.
- **Music**: low bed, ducked −12dB under VO; a soft tick on L5 sign-offs, a seal "thunk" on receipts.
- **On-screen text (L3)**: full redundancy — if VO is unclear or muted (most social autoplay), the captions alone must tell the story. The film must work with sound OFF.

## Reuse: the same stack powers the website

L0 = site background grid · L1 = SVG diagrams (rig, constellation) · L2 = stat chips with source links · L3 = copy · L4 = dispatch demo/scrubber motion · L5 = the "dispatch task" button moment. One design system, two media — the same screw, one more turn.
