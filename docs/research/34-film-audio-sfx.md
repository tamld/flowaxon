# Film "The Harness" v8/A8: Purposeful Keyboard SFX (Audition → Cut → Mix → Master)

- **Date:** 2026-11-05
- **Subjects:** `assets/video/harness-en.mp4` (16:9), `assets/video/harness-en-916.mp4` (9:16), `assets/video/harness-poster.jpg`; source pack `template/public/audio/sfx/` (video-shotcraft main checkout)
- **Operator verdict addressed:** "Âm thanh trong sandbox giống noise hơn là 1 hiệu ứng cần thiết" — the fs-546088 full-typing bed cut to 18–40s read as noise under the VO.
- **Fix strategy:** audition a replacement recording with discrete single-key articulation and a low noise floor, slice it into individual presses, align 16 clacks to the M2 `Typed` char-reveal bursts (sparse, rhythmic, real silence between bursts), keep the typing stem ≥10 dB under VO, re-master per the v8 recipe (dynamic loudnorm, TP pre-margin −2.5 → AAC 256k → mux `-c:a copy`).

---

## 1. AUDITION (Freesound CC0, `assets/scripts/sfx-source.py`, repo video-shotcraft)

Search terms: "mechanical keyboard typing", "keyboard key press click" (canon variants of "computer keyboard typing"). Mechanical evidence = `silencedetect` gap counts at −35/−45/−55 dBFS (50 ms) — gaps below −55 dB prove true silence between presses (low noise floor).

| id | title / author | downloads · rating | dur · sr | gaps @−35 | @−45 | @−55 | verdict |
| :-- | :--- | :--- | :--- | :--: | :--: | :--: | :--- |
| fs:546088 (old) | Keyboard Typing 6 (HHKB, Topre) / grcekh | 1091 · 4.3 (19) | 23.9s · 44.1k | 23 | 3 | **0** | continuous stream, floor never < −55 dB → reads as noise. **RETIRE** |
| fs:331656 | Keyboard Typing / Trollarch2 | 83426 · 4.5 (471) | 15.5s · 44.1k | 51 | 1 | 0 | dense street-typing, floor −35..−45 dB. **REJECT** |
| fs:379418 | Keyboard Typing / fennelliott | 2154 · 4.6 (16) | 12.9s · 32k | 14 | 2 | 1 | continuous, 32 kHz source. **REJECT** |
| **fs:330900** | **Mechanical Keyboard Typing.mp3 / ChickenMan669** | **765 · 4.8 (11)** | **8.2s · 48k** | **24** | **16** | **16** | **28 discrete presses, 16 true-silence gaps < −55 dB. WINNER** |
| fs:432432 | Cherry MX Brown Keyboard / NickTHH (AT2020) | 236 · 5.0 (9) | 28.0s · 44.1k | 160 | 14 | 0 | very sparse but room tone never < −55 dB. RUNNER-UP |
| fs:348239 | MECH-KEYBOARD-01.wav / newagesoup | 2531 · 4.6 (34) | 1.28s · 48k | 1 | 1 | 1 | single keystroke only — repetition would sound mechanical. REJECT |
| fs:421583 | qKey.wav / UberBosser | 1033 · 4.8 (14) | 0.16s · 44.1k | 1 | 1 | 0 | single quiet press (peak −16.3 dBFS). REJECT |

fs-330900 downloaded into `template/public/audio/sfx/` (sha256 `07d3f1b6…d19a1`, CC0, manifest + FREESOUND-CREDITS updated; `changes` records the mix-time slicing). fs-546088 retained for provenance, marked superseded.

## 2. CUT MAP — 16 clacks on the M2 `Typed` char-reveal bursts

`Harness.tsx`/`HarnessVertical.tsx` M2 (offset 451): line *i* types at local `90+i·85`, dur 38f → abs line 0: **f541–579** (18.033–19.300s), line 1: **f626–664** (20.867–22.133s), line 2: **f711–749** (23.700–24.967s). Clacks land every 6 frames inside each burst (~200 ms cadence); inter-burst gaps (19.3–20.9s, 22.1–23.7s) and intra-burst gaps are digital silence. Source presses are sliced from `typing_src.wav` (48 kHz PCM decode of fs-330900) at demuxer level (`-ss/-t`), per-press peak-normalized to −10.5 dBFS, highpass 120 Hz, 30 ms fade-out.

| slot | abs frame | time | press onset | slice dur | src peak | gain | note |
| :-- | :--: | :--- | :--- | :--: | :--: | :--: | :--- |
| A1 | f542 | 18.067 | 0.833 | 0.200 | −4.5 | −6.0 | line 0 reveal |
| A2 | f548 | 18.267 | 3.437 | 0.200 | −3.5 | −7.0 | |
| A3 | f554 | 18.467 | 0.291 | 0.150 | −10.5 | 0.0 | |
| A4 | f560 | 18.667 | 2.306 | 0.200 | −6.0 | −4.5 | |
| A5 | f566 | 18.867 | 0.453 | 0.200 | −12.0 | +1.5 | |
| A6 | f572 | 19.067 | 2.859 | 0.225 | −7.0 | −3.5 | late transient — slice extended to 3.084 |
| B1 | f628 | 20.933 | 1.397 | 0.200 | −4.1 | −6.4 | line 1 reveal |
| B2 | f634 | 21.133 | 4.133 | 0.170 | −7.7 | −2.8 | |
| B3 | f640 | 21.333 | 2.654 | 0.190 | −7.9 | −2.6 | |
| B4 | f646 | 21.533 | 4.862 | 0.200 | −0.1 | −10.4 | |
| B5 | f652 | 21.733 | 1.654 | 0.200 | −11.5 | +1.0 | |
| C1 | f713 | 23.767 | 4.496 | 0.200 | −13.4 | +2.9 | line 2 reveal |
| C2 | f719 | 23.967 | 5.666 | 0.200 | −6.0 | −4.5 | |
| C3 | f725 | 24.167 | 6.642 | 0.200 | −3.9 | −6.6 | |
| C4 | f731 | 24.367 | 5.075 | 0.180 | −5.1 | −5.4 | |
| C5 | f737 | 24.567 | 7.556 | 0.200 | −4.5 | −6.0 | |

All 16 presses are distinct takes; measured stem peaks land at −9.5…−10.9 dBFS (uniform articulation).

## 3. MIX (exact chains)

1. `typing_src.wav`: `ffmpeg -i fs-330900.mp3 -c:a pcm_s16le -ar 48000` — **required**: mp3 demuxer seeks are not sample-accurate and silently skip 20 ms transients; the 48 kHz WAV seeks exactly.
2. `stem_sfx.wav` (18-in amix, `duration=first:normalize=0`): riser fs-859482 `volume=0.8,adelay=12048`, impact fs-558238 `volume=0.9,adelay=14901` (unchanged), + 16 × `[k:a]highpass=f=120,afade=t=out:st=<dur−0.03>:d=0.03,volume=<gain>dB,adelay=<ms>|<ms>,apad=whole_dur=66,atrim=0:66`.
3. `mix_raw_bgm.wav`: v6 ducking chain unchanged — VO clean + bed/sfx via `sidechaincompress=threshold=0.02:ratio=8:attack=5:release=300:makeup=1`, bed volume envelope 0.6 in VO spans [(2.0,12.13),(16.0,37.12),(41.33,60.79)], `alimiter=limit=0.7943:attack=5:release=50:asc=1`. `mix_raw_nobgm.wav` analogous (3-in).
4. **v8 master recipe** (both masters): single-pass **dynamic** `loudnorm=I=-14:TP=-2.5:LRA=11` — the −2.5 TP pre-margin leaves 1.0 dB headroom for the AAC true-peak overshoot — → `-c:a aac -b:a 256k -ar 48000`; final mux `-map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -shortest` (stream copy, no re-encode).
5. ffmpeg 9.0.2 gotchas (cost two rebuilds): `atrim=start=…` before `adelay` inside `filter_complex` silently drops the trimmed content; `asetpts=PTS-STARTPTS` before `adelay` defeats the delay. Slice at the demuxer (`-ss/-t` per input) and keep the proven `volume→adelay→apad→atrim` branch.

**Levels:** typing window (18.0–24.77s) RMS **−36.36 dBFS** vs VO in-span RMS **−21.00 dBFS** → **15.36 dB under** (≥10 required). Ducked clack peaks −10.8…−26.5 dBFS vs ducked bed −31.4 dBFS RMS in VO → clacks read 5–20 dB above the bed: an effect, not a bed of noise.

## 4. GATES

| gate | target | 16:9 (`harness-en.mp4`) | 9:16 (`harness-en-916.mp4`) | verdict |
| :-- | :--- | :--- | :--- | :--: |
| A8-1 loudnorm | I ∈ [−15,−13] LUFS, TP ≤ −1.5 dBTP | I **−14.28**, TP **−2.34** | I **−14.28**, TP **−2.34** | **PASS** |
| A8-2 ducking | bed RMS in VO ≥8 dB below non-VO | in −31.44 / out −20.82 → **Δ 10.62 dB** | same mix | **PASS** |
| A8-3 articulation | ≥3 discrete peaks in astats windows | 13 silence gaps ≥60 ms < −40 dB in typing window; 0.1 s-window RMS alternates −29.7…−43 vs −55…−∞ | same stem | **PASS** |
| A8-4 integrity | duration/resolution, zero decode errors | 66.000s, 1920×1080 h264 + aac 48k stereo, `ffmpeg -v error` clean | 66.000s, 1080×1920, clean | **PASS** |

## 5. Deliverables & provenance

- video-shotcraft (main checkout): `template/public/audio/sfx/fs-330900.mp3` (+ manifest `changes`, FREESOUND-CREDITS edits note), `template/scripts/master_production.py` (CUT_MAP + v8 recipe), renders/masters refreshed under `template/out/` (`harness-en-1080/916.mp4`, `master_with_bgm/no_bgm.m4a`, `video16/916.mp4`).
- this worktree: `assets/video/harness-en.mp4`, `assets/video/harness-en-916.mp4`, `assets/video/harness-poster.jpg` refreshed from the mastered muxes.
- Captions untouched — orthography preserved (`g8s`, `flowaxon.com`); VO may spell letters, captions do not.
