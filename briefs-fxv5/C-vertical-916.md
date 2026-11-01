# F1-C — "The Harness" 9:16 vertical cut for social

Role: implementer. Research → implement → render → eval → loop → report. Do NOT git commit.

## Mission
The 66s film exists as 16:9 (`Harness.tsx`, 1920x1080). Produce the 1080x1920 vertical cut with the SAME audio timeline — a re-layout, not a crop.

## Where things live
- Remotion project: the directory passed to you via -add-dir (template/). Read `src/Harness.tsx` first — reuse its constants, Typed component, CAPTURE/GATES/LEDGER_ROWS data, and the exact <Audio> stack (bed2.wav, foley2.wav at frame 0; vo1 at 60; vo2 at 480; vo3 at 1240). Register your composition in `src/Root.tsx` as id="HarnessVertical" (do not remove existing registrations; keep the file's formatting style).
- The rendered master + poster are ALSO in the site repo (your worktree) at assets/video/ — reference only.

## Layout requirements (re-design for vertical, keep the craft)
1080x1920, 1980 frames @30fps, three movements with the SAME frame boundaries (0-450, 450-1238, 1238-1980):
- M1: terminal block centered upper-third; "NO BRAKES." kinetic type lower-third; grid background
- M2: split becomes STACKED — real capture lines top half, HUMAN AT THE GATE checklist bottom half; containment rings behind; drop impact ring at frame 450 (local 0-18)
- M3: vellum light background; ACT I label + serif headline; ledger rows full-width; counters stacked; end card at frame 1800 (local 562) with flowaxon.com / "Same screw. Three turns." / seal
- Typography scale: multiply 16:9 sizes by ~0.72 (frame is narrower); nothing may touch device-safe margins (60px sides, 140px top/bottom)

## Render + finish (run from the remotion template dir)
1. `npx remotion render HarnessVertical out/harness-en-916-raw.mp4 --codec h264` (composition: 1080x1920, 1980f, 30fps)
2. `ffmpeg -y -loglevel error -i out/harness-en-916-raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" out/harness-en-916.mp4`
3. Copy into YOUR worktree: `cp out/harness-en-916.mp4 assets/video/harness-en-916.mp4` (repo worktree, not the template dir)

## Acceptance
- C1 `ffprobe` duration 66.0±0.3s · 1080x1920 · 30fps
- C2 loudnorm input_i in [-15,-13]
- C3 file size > 2MB and `ffmpeg -v error -i assets/video/harness-en-916.mp4 -f null -` prints nothing (stream intact)
- C4 `npx remotion compositions` lists HarnessVertical 1080x1920 1980f
- C5 `git diff --stat` (repo worktree) shows ONLY assets/video/harness-en-916.mp4; template changes live in the add-dir tree (list the files you touched there in the report)

## Report format
RESEARCH: what you read (Harness.tsx structure, audio stack)
CHANGES: template files + repo files
EVAL: C1..C5 table with real output lines
KNOWN ISSUES / SUGGESTIONS
