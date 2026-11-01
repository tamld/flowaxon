# F1-B — Film "The Harness" v2: audio↔picture sync audit

Role: researcher/verifier. Research → measure → eval → report. Read-only on media; you write ONE report file. Do NOT re-render, do NOT edit code.

## Subject
`assets/video/harness-en.mp4` — 66s, 1920x1080, 30fps. Score: 96 BPM D minor. The audio bed (`tools-fxv5/score.py` — committed copy) and the visuals (`Harness.tsx` frame constants) were built from the same constants; your job is to PROVE sync mechanically or flag drift.

## Frame-constant contract (both sides must agree)
drop hit            frame 450  → 15.00s  (sub thump + noise slam + amber ring flash)
gate ticks+notes    frames 840+60i (i=0..5) → t = 28.0, 30.0, 32.0, 34.0, 36.0, 38.0s
typing clacks       frames 540..1220 step 4 → 18.0–40.67s
ledger plucks       frames 1240+55i (i=0..5) → 41.33s + i*1.833s
end-card hit        frame 1800 → 60.00s
VO spans            vo1 2.00–12.13s · vo2 16.00–37.12s · vo3 41.33–60.79s (edge-tts Andrew)
loudness target     EBU R128 I=-14 LUFS, TP=-1.5dB

## Measurements to run (all mechanical)
M1 duration/res: `ffprobe -v error -show_entries format=duration,stream=width,height,r_frame_rate -of json assets/video/harness-en.mp4`
M2 loudness: `ffmpeg -i assets/video/harness-en.mp4 -t 66 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -12` → input_i within [-15,-13]
M3 tick presence: for each gate time T, compare RMS in [T, T+0.08] vs [T-0.4, T-0.32]:
   `ffmpeg -ss <start> -t 0.08 -i assets/video/harness-en.mp4 -af astats=metadata=1:reset=1 -f null - 2>&1 | grep "RMS level dB"` (expect: at-tick window ≥ 3dB louder than off-tick window; ticks are 1.8kHz damped bursts)
M4 typing energy: RMS in [18,40] vs [41,59] (no clacks in M3) — M2 window > M3 window
M5 drop: RMS in [14.9,15.3] vs [14.0,14.4] — expect spike (thump)
M6 picture at drop: `ffmpeg -ss 15.05 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/drop.png -ss 14.9 -i assets/video/harness-en.mp4 -frames:v 1 /tmp/predrop.png` then `ffmpeg -i /tmp/drop.png -vf signalstats -f null - 2>&1 | grep YAVG` vs predrop — flash must raise YAVG
M7 code cross-check: read tools-fxv5/score.py constants (GATE_FRAMES, TYPE_START/END, LEDGER_FRAMES, ENDCARD, VO_SPANS) vs Harness.tsx (Sequence boundaries 450/788/1238/742, gatesOn 390+60i, endcard local 562, Audio startFrames 60/480/1240) → list any mismatch

## Deliverable
`docs/research/21-film-v2-sync-eval.md` (~120-200 lines): header (subject, date, method), per-measurement section with command + raw output line + PASS/FAIL, sync verdict, prioritized fix list (if any), epistemic note (what was measured vs inferred). English.

## Acceptance
- B1 report file exists with all 7 measurement sections
- B2 every PASS/FAIL backed by a real command output line (no invented numbers)
- B3 `git diff --stat` shows ONLY docs/research/21-film-v2-sync-eval.md

## Report format
EVAL: table M1..M7 → PASS/FAIL → one-line evidence
VERDICT: sync ok / fix needed (list)
