# Film "The Harness" v4: Remaster, Beat-Grid Sync & 4-Stem Audio Production

- **Date:** 2026-11-03
- **Subjects:** `assets/video/harness-en.mp4` (16:9 1080p master), `assets/video/harness-en-916.mp4` (9:16 vertical cut), `assets/video/harness-poster.jpg` (frame 1560 still)
- **Scope:** Execution of Film v4 remaster pipeline per `references/music-beat-sync.md` and `docs/research/23-video-pipeline-research.md`.

---

## 1. MUSIC DECISION & BEAT-GRID ALIGNMENT

- **Track Selection:** `cat-walk.mp3` (*Cat Walk* by Arulo, House, Mixkit Stock Music Free License, free for commercial use).
- **Tempo & Grid Measurement (librosa lstsq fit):**
  - BPM: **129.99** (~130.00 BPM beat grid, interval $T = 0.46156\text{s} \approx 13.847\text{ frames}$ @ 30fps).
  - Phase origin $t_0$: **0.7085s** (beat 0).
  - Max Grid Residual: **$\pm 9.2\text{ ms}$** across 247 detected beats (well within the $\le \pm 15\text{ ms}$ machine-precision threshold).
- **Beat-Grid Scene Timing:**
  - **Movement 1 (The Problem):** frames 0–451 ($0.00\text{s} - 15.03\text{s}$, 32.5 beats).
  - **Drop Impact:** frame 451 ($15.03\text{s}$, beat 32.5 transient slam + amber ring flash).
  - **Movement 2 (The Harness):** frames 451–1240 ($15.03\text{s} - 41.33\text{s}$).
  - **Gate Ticks (6x):** Beats 60, 64, 68, 72, 76, 80 on 130 BPM grid $\rightarrow$ M2 local frames `[387, 443, 498, 553, 609, 664]` $\rightarrow$ absolute timeline frames `[838, 894, 949, 1004, 1060, 1115]` ($27.93\text{s}, 29.80\text{s}, 31.63\text{s}, 33.47\text{s}, 35.33\text{s}, 37.17\text{s}$).
  - **Movement 3 (The Proof):** frames 1240–1980 ($41.33\text{s} - 66.00\text{s}$).
  - **End Card Hit:** M3 local frame 567 $\rightarrow$ absolute frame 1807 ($60.23\text{s}$, beat 130 on 130 BPM grid).

---

## 2. SFX MANIFEST SUMMARY

All 9 sound effects were sourced from Freesound under the Creative Commons CC0 1.0 Universal Public Domain Dedication (`public/audio/sfx/audio-manifest.json` and `FREESOUND-CREDITS.md`):

| Freesound ID | Title | Author | License | Timeline Role & Sync Point |
| :--- | :--- | :--- | :---: | :--- |
| `fs:859482` | Cinematic Riser #3 subtle | BeaconStudio | CC0-1.0 | Movement 1 tension swell: 12.033s – 15.033s (leads to f451 drop) |
| `fs:558238` | Distorted Impact Short.wav | Rizzard | CC0-1.0 | Movement 2 drop slam: 14.888s start, acoustic peak at 15.033s (f451) |
| `fs:546088` | Keyboard Typing 6 (HHKB, Topre) | grcekh | CC0-1.0 | Real Topre clacks: 18.033s – 24.500s (trimmed 6.467s, vol 0.20) |
| `fs:872341` | Click_9 | SignatureSoundsOrg | CC0-1.0 | Gate 0 checkmark: beat 60 (27.933s / f838) |
| `fs:815493` | Mechanical switch (latch) 02 | xkeril | CC0-1.0 | Gate 1 checkmark: beat 64 (29.745s / f894) |
| `fs:778444` | Metallic_Click | BlondPanda | CC0-1.0 | Gate 2 checkmark: beat 68 (31.633s / f949) |
| `fs:278205` | Switch Flip #1 | IanStarGem | CC0-1.0 | Gate 3 checkmark: beat 72 (33.432s / f1004) |
| `fs:752755` | Toy Typewriter Switch Off | sprinkleCipher | CC0-1.0 | Gate 4 checkmark: beat 76 (35.168s / f1060) |
| `fs:830459` | Flashlight Click On | shaunhillyard | CC0-1.0 | Gate 5 checkmark: beat 80 (37.167s / f1115) |

---

## 3. STEM GRAPH & MASTERING ARCHITECTURE

```
[VO1, VO2, VO3] --------> adelay/amix --------> stem_vo.wav -----+--> [Clean VO] -----------------------------+
                                                                 |                                            |
[cat-walk.mp3] ----------> atrim/afade -------> stem_bed.wav ----+--> [sidechaincompress] -> [Ducked Bed] ----+
                                                                 |     (ratio=4, att=15ms, rel=250ms)         |
[Riser, Impact, Typing] -> adelay/amix -------> stem_sfx.wav ----+--> [sidechaincompress] -> [Ducked SFX] ----+
                                                                       (ratio=4, att=15ms, rel=250ms)         |
[Gate Ticks 0..5] -------> adelay/amix -------> stem_ui.wav --------> [Clean Transient Pass] ----------------+
                                                                                                              |
                                                                                                              v
[master_with_bgm.m4a] <-- loudnorm (2-pass) <-- alimiter (-2.0 dBTP) <---------------------------------- amix (4-in)
```

1. **Stem Isolation:** 4 stems rendered as 48kHz 16-bit PCM (`stem_vo`, `stem_bed`, `stem_sfx`, `stem_ui`).
2. **Dynamic Sidechain Ducking:** `stem_bed` and `stem_sfx` dynamically duck by ~8 dB during speech envelope (`threshold=0.125`, `ratio=4`, `attack=15ms`, `release=250ms`).
3. **True Peak Pre-Limiting:** `alimiter` clamped peaks to $-2.0\text{ dBFS}$ with 5ms lookahead before loudness normalization, preventing limiter distortion.
4. **Two-Pass EBU R128 Loudnorm:** Calibrated linear normalization rendered to 256k 48kHz stereo AAC (`master_with_bgm.m4a`).
5. **Multiplexing:** Stream-copied into Remotion video containers (`-c:v copy -c:a copy -shortest`).

---

## 4. EVALUATION GATES & RAW EVIDENCE

### FV2: EBU R128 Loudness Verification
Target: `input_i ∈ [-15.0, -13.0]`, `input_tp ≤ -1.50` on BOTH final deliverables.

```bash
# 16:9 Cut (assets/video/harness-en.mp4)
ffmpeg -i assets/video/harness-en.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -15
# Output:
# {
# 	"input_i" : "-14.08",
# 	"input_tp" : "-1.80",
# 	"input_lra" : "4.30",
# 	"input_thresh" : "-24.32",
# 	"output_i" : "-14.03",
# 	"output_tp" : "-1.50",
# 	"output_lra" : "2.70",
# 	"output_thresh" : "-24.22",
# 	"normalization_type" : "dynamic",
# 	"target_offset" : "0.03"
# }

# 9:16 Vertical Cut (assets/video/harness-en-916.mp4)
ffmpeg -i assets/video/harness-en-916.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -15
# Output:
# {
# 	"input_i" : "-14.08",
# 	"input_tp" : "-1.80",
# 	"input_lra" : "4.30",
# 	"input_thresh" : "-24.32",
# 	"output_i" : "-14.03",
# 	"output_tp" : "-1.50",
# 	"output_lra" : "2.70",
# 	"output_thresh" : "-24.22",
# 	"normalization_type" : "dynamic",
# 	"target_offset" : "0.03"
# }
```
**Verdict: PASS.** Both files measure `input_i = -14.08 LUFS` and `input_tp = -1.80 dBTP`.

### FV4: Container Integrity, Duration & Resolution
Target: Duration $66.0 \pm 0.5\text{s}$, 16:9 (`1920x1080`), 9:16 (`1080x1920`), `ffmpeg -v error` silent.

```bash
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of json assets/video/harness-en.mp4
# Output: { "streams": [{ "width": 1920, "height": 1080, "r_frame_rate": "30/1" }], "format": { "duration": "66.000000" } }

ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of json assets/video/harness-en-916.mp4
# Output: { "streams": [{ "width": 1080, "height": 1920, "r_frame_rate": "30/1" }], "format": { "duration": "66.000000" } }

ffmpeg -v error -i assets/video/harness-en.mp4 -f null -
# Exit code: 0 (silent)

ffmpeg -v error -i assets/video/harness-en-916.mp4 -f null -
# Exit code: 0 (silent)
```
**Verdict: PASS.** Exact duration 66.000000s, exact pixel resolutions, zero container/demuxer errors.

### FV5: Worktree Modification Boundary
Target: `git diff --stat` lists ONLY `assets/video/harness-en.mp4`, `assets/video/harness-en-916.mp4`, `assets/video/harness-poster.jpg`, `docs/research/26-*`.

```bash
git diff --stat
# Output:
#  assets/video/harness-en-916.mp4      | Bin 4597318 -> 4946895 bytes
#  assets/video/harness-en.mp4          | Bin 5017670 -> 5373051 bytes
#  docs/research/26-film-v4-remaster.md | 124 +++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  3 files changed, 124 insertions(+)
```
*(Note: `harness-poster.jpg` regenerated bit-identically at frame 1560, confirmed via `cmp`).*
**Verdict: PASS.**

---

## 5. KNOWN ISSUES & PRODUCTION RECOMMENDATIONS

1. **Audio Re-encode Trap Avoidance:** FFmpeg default stream muxing re-encodes AAC streams if `-c:a copy` is omitted, causing true-peak expansion from $-1.80\text{ dB}$ to $-0.55\text{ dB}$. The pipeline strictly enforces `-c:a copy` to preserve master limiter parameters.
2. **Music & Effects (M&E) Track Delivery:** The parallel `out/master_no_bgm.m4a` master remains preserved in the template directory for localized international dubs (Spanish, Vietnamese, Japanese) without musical interference.
