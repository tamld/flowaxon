# 33 — Command-truth: canonical commands + human translation layer

## Defect (operator-caught, 2026-11-04)
Film M2 displayed `g8s submit -provider agy -model ...` — missing the two REQUIRED flags
(--idempotency-key, --prompt) → the command failed if typed. Receipts displayed as raw hex
(96fd2088) with zero human meaning. Root cause: verification gates tested CRAFT (LUFS,
beat-sync, SRI, tells) but never SEMANTIC correctness of technical content.

## Law
1. Every command shown = verbatim-parseable (flags exist, required present) — verified by
   tools/command_truth.py.
2. Every machine artifact carries a one-line human translation.
3. Craft gates do not substitute for truth gates.

## Fixes
- Harness.tsx + HarnessVertical.tsx: canonical `g8s submit --idempotency-key demo-1
  --prompt "inventory the module" --permission read_only`
- Site terminal (assets/v5/site.js): canonical command + human lines
  ("one task enters the queue, carrying its own permission slip")
- Film M2: dim human lines under each machine beat
- tools/command_truth.py: extracts every displayed `g8s …` from index.html + film
  sources → asserts flags exist + required present. GATE OUTPUT: PASS.

## Gate output (verbatim)
COMMAND-TRUTH: PASS — every displayed command parses (flags valid, required present)
