# Film "The Harness" v2: Audio↔Picture Sync & Technical Audit

- **Subject:** `assets/video/harness-en.mp4` (66s, 1920x1080, 30fps)
- **Reference Code:** `tools-fxv5/score.py` (audio score synthesis) vs `Harness.tsx` (Remotion visual timeline)
- **Audit Date:** 2026-11-01
- **Method:** Deterministic mechanical measurements (`ffprobe`, `ffmpeg astats/loudnorm/signalstats`) and static AST/constant cross-verification.

---

## Executive Summary & EVAL Matrix

| Test | Dimension | Status | Key Evidence |
| :--- | :--- | :---: | :--- |
| **M1** | Duration, Resolution, FPS | **PASS** | 1920x1080 @ 30.0 fps, 1980 video frames (66.00s), 66.10s container duration |
| **M2** | EBU R128 Loudness & Peak | **FAIL** | `input_i: -16.76` LUFS (below [-15, -13]); `input_tp: -0.80` dB (above -1.50 dB ceiling) |
| **M3** | Gate Tick Audio Presence | **PASS** | 6/6 gate hits exceed local baseline by +3.20 dB to +28.45 dB (target $\ge$ +3.0 dB) |
| **M4** | Typing Sound Energy | **PASS** | M2 typing window RMS (-21.59 dB) > M3 non-typing RMS (-23.27 dB) by +1.68 dB |
| **M5** | Drop Audio Thump | **PASS** | Drop window [14.9, 15.3s] RMS (-12.14 dB) vs pre-drop (-16.16 dB) $\rightarrow$ +4.02 dB spike |
| **M6** | Picture Luminance at Drop | **FAIL** | Drop YAVG (24.52) < Pre-drop (26.70); luma decreased by -2.18 (thin ring, no flash) |
| **M7** | Code Constant Cross-Check | **FAIL** | Ledger pluck +2 frame offset (1240 vs 1238); typing clacks +47 frame trailing overshoot |

**VERDICT: FIX NEEDED** (4 passes, 3 failures across loudness normalization, drop luminance flash, and two timeline constant drifts).

---

## Detailed Measurement Logs

### M1 — Duration, Resolution, and Frame Rate
**Target:** 66.0s duration, 1920x1080 resolution, 30 fps.
- **Command:** `ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of json assets/video/harness-en.mp4`
- **Raw Output:**
```json
{ "streams": [{ "width": 1920, "height": 1080, "r_frame_rate": "30/1" }], "format": { "duration": "66.100000" } }
```
- **Evaluation:** Video stream duration is exactly 1980 frames at 30 fps ($1980 / 30 = 66.00$s). Extra 0.10s is standard AAC encoder container padding. Resolution is 1920x1080.
- **Status:** **PASS**

---

### M2 — Loudness Compliance (EBU R128)
**Target:** Integrated loudness $I = -14.0$ LUFS ($\pm 1.0$ LUFS window: $[-15.0, -13.0]$); True Peak $\text{TP} \le -1.5$ dB.
- **Command:** `ffmpeg -i assets/video/harness-en.mp4 -t 66 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | grep -A 10 '"input_i"'`
- **Raw Output:**
```json
	"input_i" : "-16.76",
	"input_tp" : "-0.80",
	"input_lra" : "11.30",
	"input_thresh" : "-27.32",
	"output_i" : "-16.20",
	"output_tp" : "-1.50",
	"output_lra" : "6.40"
```
- **Evaluation:** `input_i` is -16.76 LUFS (2.76 LUFS under target, 1.76 LUFS below the -15.0 LUFS threshold). `input_tp` is -0.80 dB (+0.70 dB above the -1.5 dB peak limit).
- **Status:** **FAIL**

---

### M3 — Gate Tick Audio Presence
**Target:** Compare RMS in $[T, T+0.08\text{s}]$ vs off-tick $[T-0.4\text{s}, T-0.32\text{s}]$ for each gate $T \in \{28.0, 30.0, 32.0, 34.0, 36.0, 38.0\}$. Required: $\Delta \ge +3.0$ dB.
- **Command:** `ffmpeg -ss <T> -t 0.08 -i assets/video/harness-en.mp4 -af astats=metadata=1:reset=1 -f null - 2>&1 | grep "RMS level dB"`
- **Raw Outputs & Energy Deltas:**
  - Gate 0 ($T=28.0\text{s}$): at-tick `RMS level dB: -14.247290` vs off-tick `RMS level dB: -24.692161` $\rightarrow \mathbf{\Delta = +10.44\text{ dB}}$ (**PASS**)
  - Gate 1 ($T=30.0\text{s}$): at-tick `RMS level dB: -12.671068` vs off-tick `RMS level dB: -41.121305` $\rightarrow \mathbf{\Delta = +28.45\text{ dB}}$ (**PASS**)
  - Gate 2 ($T=32.0\text{s}$): at-tick `RMS level dB: -15.132458` vs off-tick `RMS level dB: -34.129084` $\rightarrow \mathbf{\Delta = +19.00\text{ dB}}$ (**PASS**)
  - Gate 3 ($T=34.0\text{s}$): at-tick `RMS level dB: -14.727239` vs off-tick `RMS level dB: -36.287722` $\rightarrow \mathbf{\Delta = +21.56\text{ dB}}$ (**PASS**)
  - Gate 4 ($T=36.0\text{s}$): at-tick `RMS level dB: -14.388709` vs off-tick `RMS level dB: -18.836635` $\rightarrow \mathbf{\Delta = +4.45\text{ dB}}$ (**PASS**)
  - Gate 5 ($T=38.0\text{s}$): at-tick `RMS level dB: -14.117641` vs off-tick `RMS level dB: -17.315248` $\rightarrow \mathbf{\Delta = +3.20\text{ dB}}$ (**PASS**)
- **Status:** **PASS** (6/6 gates confirm physical acoustic transient coincident with visual chip pops).

---

### M4 — Typing Sound Energy Presence
**Target:** Audio RMS in typing window $[18.0, 40.0\text{s}]$ must exceed non-typing window $[41.0, 59.0\text{s}]$.
- **Commands:**
  `ffmpeg -ss 18 -t 22 -i assets/video/harness-en.mp4 -af astats -f null - 2>&1 | grep "RMS level dB"`
  `ffmpeg -ss 41 -t 18 -i assets/video/harness-en.mp4 -af astats -f null - 2>&1 | grep "RMS level dB"`
- **Raw Output:**
  - M2 Typing Window $[18, 40\text{s}]$: `[Parsed_astats_0] RMS level dB: -21.587809`
  - M3 Non-typing Window $[41, 59\text{s}]$: `[Parsed_astats_0] RMS level dB: -23.266248`
- **Evaluation:** M2 typing audio is $+1.68$ dB louder than M3 ambient audio.
- **Status:** **PASS**

---

### M5 — Drop Audio Impact Spike
**Target:** Audio thump spike in drop window $[14.9, 15.3\text{s}]$ compared to pre-drop baseline $[14.0, 14.4\text{s}]$.
- **Commands:**
  `ffmpeg -ss 14.9 -t 0.4 -i assets/video/harness-en.mp4 -af astats -f null - 2>&1 | grep "RMS level dB"`
  `ffmpeg -ss 14.0 -t 0.4 -i assets/video/harness-en.mp4 -af astats -f null - 2>&1 | grep "RMS level dB"`
- **Raw Output:**
  - Drop Window $[14.9, 15.3\text{s}]$: `[Parsed_astats_0] RMS level dB: -12.137676`
  - Pre-drop Window $[14.0, 14.4\text{s}]$: `[Parsed_astats_0] RMS level dB: -16.159186`
- **Evaluation:** Sub thump + noise slam produces a $+4.02$ dB spike across the frame 450 boundary.
- **Status:** **PASS**

---

### M6 — Picture Luminance at Drop Hit
**Target:** Flash at drop ($15.05\text{s}$) must raise `YAVG` above pre-drop frame ($14.90\text{s}$).
- **Commands:**
  `ffmpeg -y -ss 15.05 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/drop.png`
  `ffmpeg -y -ss 14.9 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/predrop.png`
  `ffmpeg -i /tmp/drop.png -vf signalstats,metadata=mode=print -f null - 2>&1 | grep YAVG`
  `ffmpeg -i /tmp/predrop.png -vf signalstats,metadata=mode=print -f null - 2>&1 | grep YAVG`
- **Raw Output:**
  - Drop PNG ($15.05\text{s}$): `[Parsed_metadata_1] lavfi.signalstats.YAVG=24.5248`
  - Pre-drop PNG ($14.90\text{s}$): `[Parsed_metadata_1] lavfi.signalstats.YAVG=26.701`
  *(Native video stream luma: $15.05\text{s} = 10.44$ vs $14.90\text{s} = 13.01$)*
- **Evaluation:** Luma dropped by $-2.18$ units ($\Delta = -8.1\%$). In `Harness.tsx`, M1 ends with prominent bold red typography (`NO BRAKES.`). At frame 450, M1 text vanishes and M2 introduces only an unfilled stroke circle (`fill="none"`, `strokeWidth` 10$\rightarrow$0). Without a full-frame amber luminance flash, the cut to dark background reduces average scene brightness.
- **Status:** **FAIL**

---

### M7 — Code Constant Cross-Check (`tools-fxv5/score.py` vs `Harness.tsx`)
**Source Files Inspected:** `tools-fxv5/score.py` vs `/Users/tamld/Documents/github/tools/video-shotcraft/template/src/Harness.tsx`.

1. **Scene Sequences:** `score.py` `M2_START=450, M3_START=1238, DUR=66.0` matches `Harness.tsx` `Sequence from={0|450|1238} dur={450|788|742}` $\rightarrow$ **MATCH** (0-frame drift).
2. **Gate Ticks:** `score.py` `GATE_FRAMES = [840 + 60*i]` matches `Harness.tsx` M2 local `390 + 60*i` + 450 = `840 + 60*i` $\rightarrow$ **MATCH** (0-frame drift).
3. **End-Card Downbeat:** `score.py` `ENDCARD = 1800` (60.00s) matches `Harness.tsx` local 562 + 1238 = 1800 $\rightarrow$ **MATCH** (0-frame drift).
4. **VO Audio Tracks:** `score.py` `VO_SPANS = [(2.0, ...), (16.0, ...), (41.33, ...)]` matches `Harness.tsx` `<Audio startFrame={60|480|1240}>` $\rightarrow$ **MATCH**.
5. **Ledger Row Reveal vs Audio Plucks:**
   - `score.py`: `LEDGER_FRAMES = [1240 + 55*i]` $\rightarrow$ plucks at `[1240, 1295, 1350, 1405, 1460, 1515]`.
   - `Harness.tsx`: In M3 (`from={1238}`), visual row opacity starts at local `i * 55` $\rightarrow$ absolute `[1238, 1293, 1348, 1403, 1458, 1513]`.
   - **Discrepancy:** Visual ledger row appears **2 frames (66.7ms) before** the corresponding audio pluck. $\rightarrow$ **MISMATCH**
6. **Typing Window Bounds:**
   - `score.py`: `TYPE_START, TYPE_END = 540, 1220` (clacks play continuously from frame 540 to 1220).
   - `Harness.tsx`: M2 typing begins at local frame 90 (abs 540). The 8th line begins at local 685 (abs 1135) with `dur=38`, finishing at local 723 (abs 1173 / 39.10s).
   - **Discrepancy:** Foley typing clacks continue for **47 trailing frames (1.57s)** past visual typing completion while screen is static. $\rightarrow$ **MISMATCH**
- **Status:** **FAIL**

---

## Prioritized Fix List

1. **P1 — Remaster Mix to EBU R128 (Resolves M2):**
   - Run combined audio track through two-pass `loudnorm=I=-14:TP=-1.5:LRA=11` filter before final muxing to boost integrated luma from -16.76 to -14.0 LUFS and clamp true peaks below -1.5 dB.
2. **P2 — Align Ledger Visual Rows (Resolves M7):**
   - In `Harness.tsx`, delay ledger row animation by 2 frames (`f - 2 - i * 55`) so visual row reveals coincide exactly with audio pluck frames $1240 + 55i$.
3. **P3 — Clamp Typing Clacks to Match Screen Text (Resolves M7):**
   - In `tools-fxv5/score.py`, change `TYPE_END = 1174` (or 1173) so Foley clacks stop when the 8th terminal line completes typing.
4. **P4 — Add Ambient Drop Flash (Resolves M6):**
   - In `Harness.tsx` M2, add a 4-frame amber luminance flash (`<AbsoluteFill style={{ backgroundColor: AMBER, opacity: interpolate(f, [0, 4], [0.35, 0]) }} />`) so frame 450 registers an unmistakable visual energy surge matching the audio thump.

---

## Epistemic Boundary Note

- **Mechanically Measured:**
  - Video stream geometry ($1920\times 1080$, 30fps, 1980 frames) via `ffprobe`.
  - Integrated loudness (-16.76 LUFS) and true peak (-0.80 dB) via `loudnorm`.
  - Gate acoustic transient RMS and signal-to-ambient deltas (+3.20 to +28.45 dB) via `astats`.
  - Drop thump audio spike (+4.02 dB) and typing window contrast (+1.68 dB) via `astats`.
  - Drop frame luminance reduction (-2.18 YAVG on PNG, -2.58 YAVG native YUV) via `signalstats`.
- **Inferred from Source Cross-Check:**
  - 2-frame ledger pluck lag and 47-frame typing overshoot inferred by algebraic mapping between `tools-fxv5/score.py` loop ranges and `Harness.tsx` sequence transforms.
