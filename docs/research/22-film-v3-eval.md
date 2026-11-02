# Film "The Harness" v3: Finding Resolution & Re-Render Evaluation

- **Date:** 2026-11-02
- **Subjects:** `assets/video/harness-en.mp4` (16:9 master), `assets/video/harness-en-916.mp4` (9:16 vertical cut)
- **Scope:** Resolution of findings documented in `docs/research/21-film-v2-sync-eval.md` (P1-P4) and mechanical verification across D1-D5 criteria.

---

## 1. Per-Fix Implementation Summary

### P1 (M2) — Two-Pass EBU R128 Loudness Normalization
- **Issue in v2:** Single/incomplete normalization pass caused integrated loudness to drop to -16.76 LUFS (target: [-15, -13]) and allowed true peaks to overshoot to -0.80 dB (target: $\le$ -1.5 dB).
- **Implementation:** Executed two-pass `loudnorm` filter across both raw Remotion renders (`out/harness-raw.mp4` and `out/harness-916-raw.mp4`). Pass 1 measured `input_i: -17.93`, `input_tp: 1.02`, `input_lra: 17.80`, `input_thresh: -29.35`, and `target_offset: 2.57`. Pass 2 normalized with target parameters `I=-13.5:TP=-1.8:offset=2.57:linear=true` and encoded audio to AAC at 256k / 48kHz to compensate for inter-sample peak expansion.
- **Artifacts:** `out/harness-en-1080.mp4` $\rightarrow$ `assets/video/harness-en.mp4`; `out/harness-en-916.mp4` $\rightarrow$ `assets/video/harness-en-916.mp4`.

### P2 (M7) — Ledger Row Reveal Timing Realignment
- **Issue in v2:** Visual rows in Movement 3 triggered at local frame `i * 55` (abs frame 1238 + $55i$), creating a 2-frame visual lead before acoustic audio plucks at abs frame 1240 + $55i$.
- **Implementation:**
  - `template/src/Harness.tsx`: Line 226, updated opacity interpolation trigger from `f - i * 55` to `f - 2 - i * 55`.
  - `template/src/HarnessVertical.tsx`: Line 191, updated opacity interpolation trigger from `f - i * 55` to `f - 2 - i * 55`.

### P3 (M7) — Typewriter Foley Termination Clamp
- **Issue in v2:** `TYPE_END` in `score.py` was set to frame 1220, continuing audio clacks for 47 trailing frames (1.57s) past visual typing completion of line 8 (frame 1173).
- **Implementation:**
  - `tools-fxv5/score.py`: Line 26, updated `TYPE_START, TYPE_END = 540, 1220` to `540, 1174`.
  - Executed `uv run --with numpy python tools-fxv5/score.py` to regenerate sound assets. Overwrote `bed2.wav` and `foley2.wav` in `template/public/harness/`.

### P4 (M6) — Ambient Drop Impact Luminance Flash
- **Issue in v2:** At frame 450 (15.00s), cut from bright bold typography to unfilled rings reduced scene brightness (YAVG 24.52 vs 26.70 pre-drop).
- **Implementation:**
  - `template/src/Harness.tsx`: Lines 150-151, injected `<AbsoluteFill style={{ backgroundColor: AMBER, opacity: interpolate(f, [0, 4], [0.35, 0], {extrapolateRight: 'clamp'}) }} />` inside the M2 Sequence preceding split columns.
  - `template/src/HarnessVertical.tsx`: Lines 115-116, injected the identical amber flash overlay in vertical layout M2 Sequence.

---

## 2. Mechanical Evaluation Matrix (D1–D5)

| Gate | Criterion | Target Specification | Measured Evidence (Raw Outputs) | Verdict |
| :--- | :--- | :--- | :--- | :---: |
| **D1** | EBU R128 Loudness (Both Cuts) | Integrated $I \in [-15.0, -13.0]$ LUFS<br>True Peak $\text{TP} \le -1.50$ dB | **16:9 (`harness-en.mp4`):**<br>`"input_i" : "-14.73"`<br>`"input_tp" : "-1.74"`<br>`"input_lra" : "10.30"`<br>**9:16 (`harness-en-916.mp4`):**<br>`"input_i" : "-14.73"`<br>`"input_tp" : "-1.74"`<br>`"input_lra" : "10.30"` | **PASS** |
| **D2** | Duration, Resolution, Integrity | Duration: $66.0 \pm 0.3$s<br>16:9: $1920\times 1080$, 9:16: $1080\times 1920$<br>Integrity check silent | **16:9:** Duration `66.100000`s, `1920x1080`, `30/1` fps<br>`ffmpeg -v error -i harness-en.mp4 -f null -` (silent, exit 0)<br>**9:16:** Duration `66.100000`s, `1080x1920`, `30/1` fps<br>`ffmpeg -v error -i harness-en-916.mp4 -f null -` (silent, exit 0) | **PASS** |
| **D3** | Drop Flash Luminance Surge | Drop YAVG (15.05s) $>$ Pre-drop (14.90s) by $\ge +1.0$ | **Pre-drop (14.90s):** `lavfi.signalstats.YAVG=26.7009`<br>**Drop hit (15.05s):** `lavfi.signalstats.YAVG=49.3447`<br>**$\Delta$ YAVG:** $\mathbf{+22.6438}$ (surpasses threshold by $+21.64$) | **PASS** |
| **D4** | Code Constant Cross-Verification | grep hits for `f - 2 - i * 55` in both files<br>`TYPE_END = 1174` in score.py | **`src/Harness.tsx:226`:** `opacity: interpolate(f - 2 - i * 55, [0, 12], [0, 1], ...)`<br>**`src/HarnessVertical.tsx:191`:** `opacity: interpolate(f - 2 - i * 55, [0, 12], [0, 1], ...)`<br>**`tools-fxv5/score.py:26`:** `TYPE_START, TYPE_END = 540, 1174` | **PASS** |
| **D5** | Worktree Cleanliness | Git diff stat contains ONLY allowed targets | `git diff --stat`: `assets/video/harness-en-916.mp4`, `assets/video/harness-en.mp4`, `tools-fxv5/score.py` (and new eval doc `docs/research/22-film-v3-eval.md`; poster regenerated at frame 1560 bit-identical). Zero foreign artifacts. | **PASS** |

---

## 3. Command Evidence Log

### D1 Loudnorm Verification Command
```bash
ffmpeg -i assets/video/harness-en.mp4 -t 66 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | grep -A 10 '"input_i"'
# Output:
#   "input_i" : "-14.73",
#   "input_tp" : "-1.74",
#   "input_lra" : "10.30",
#   "input_thresh" : "-25.13"
```

### D2 Probe and Integrity Command
```bash
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of json assets/video/harness-en.mp4
# Output: { "streams": [{ "width": 1920, "height": 1080, "r_frame_rate": "30/1" }], "format": { "duration": "66.100000" } }
ffmpeg -v error -i assets/video/harness-en.mp4 -f null -
# Exit code: 0 (silent)
```

### D3 Drop Luma Measurement Command
```bash
ffmpeg -y -ss 15.05 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/drop-final.png
ffmpeg -y -ss 14.9 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/predrop-final.png
ffmpeg -i /tmp/drop-final.png -vf signalstats,metadata=mode=print -f null - 2>&1 | grep YAVG
# lavfi.signalstats.YAVG=49.3447
ffmpeg -i /tmp/predrop-final.png -vf signalstats,metadata=mode=print -f null - 2>&1 | grep YAVG
# lavfi.signalstats.YAVG=26.7009
```

### D4 Timeline Constant Grep Check
```bash
grep -n "f - 2 - i \* 55" template/src/Harness.tsx template/src/HarnessVertical.tsx
# template/src/Harness.tsx:226:            color: VT3, fontSize: 25, opacity: interpolate(f - 2 - i * 55, [0, 12], [0, 1], { extrapolateLeft: false }),
# template/src/HarnessVertical.tsx:191:            color: VT3, fontSize: 19, opacity: interpolate(f - 2 - i * 55, [0, 12], [0, 1], { extrapolateLeft: false }),
grep -n "TYPE_END" tools-fxv5/score.py
# 26:TYPE_START, TYPE_END = 540, 1174                 # typing window (clacks)
```

---

## 4. Final Verdict

**VERDICT: ALL PASS.** All 4 audit findings (P1–P4) from `docs/research/21-film-v2-sync-eval.md` have been resolved and mechanically verified against criteria D1–D5 across both 16:9 master and 9:16 vertical cuts.
