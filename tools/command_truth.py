#!/usr/bin/env python3
"""Command-truth gate: every g8s command displayed on the site/film must use
only flags that exist in `g8s submit --help` AND include the required flags
(--idempotency-key, --prompt). Scans site index.html + film compositions."""
import re, subprocess, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
TS = pathlib.Path("/Users/tamld/Documents/github/tools/video-shotcraft/template/src")
sources = [ROOT/"index.html", TS/"Harness.tsx", TS/"HarnessVertical.tsx"]
proc = subprocess.run([str(pathlib.Path.home()/"Documents/github/g8s/bin/g8s"), "submit", "--help"],
                          capture_output=True, text=True)
help_out = proc.stderr + proc.stdout
valid = set(re.findall(r'-+([a-z][\w-]*)', help_out))
required = {"idempotency-key", "prompt"}
fails = []
for src in sources:
    if not src.exists(): continue
    h = src.read_text(errors="replace")
    for m in re.finditer(r'g8s submit ([^"`\n]*)', h):
        cmd = m.group(1)
        flags = set(re.findall(r'-{1,2}([a-z][\w-]*)', cmd))
        unknown = flags - valid - {"help"}
        missing = required - flags
        if unknown: fails.append(f"{src.name}: unknown {sorted(unknown)} in `{cmd[:70]}`")
        if missing: fails.append(f"{src.name}: missing {sorted(missing)} in `{cmd[:70]}`")
if fails:
    print("COMMAND-TRUTH: FAIL")
    [print("  X", f) for f in fails]
    sys.exit(1)
print("COMMAND-TRUTH: PASS — every displayed command parses (flags valid, required present)")
