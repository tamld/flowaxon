#!/usr/bin/env python3
"""BT-1 gate: assets/v5/ledger.json <-> REVEAL_MAP in assets/v5/theater.js must be 1:1.

Mechanically asserts:
  1. Reveal window count == ledger row count.
  2. Order identical: (wave, sha) pairs match row-for-row.
  3. Every sha in the ledger resolves to a real commit in git history (git cat-file).

Parser design note: the REVEAL_MAP literal is extracted with a bracket-balanced
scan (string-aware), then each window object is split on brace balance. Field
extraction regexes only ever run INSIDE a single extracted object, so a field
name elsewhere in theater.js can never leak into the map (the classic
cross-object regex-drift bug this gate exists to prevent).
"""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEDGER = ROOT / "assets" / "v5" / "ledger.json"
THEATER = ROOT / "assets" / "v5" / "theater.js"

fails = []


def extract_array(src, decl):
    """Return the source text between `decl = [` and its balanced closing ]."""
    marker = decl + " = ["
    start = src.index(marker) + len(marker)
    depth, i, in_str, esc = 1, start, None, False
    while i < len(src):
        c = src[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == in_str:
                in_str = None
        else:
            if c in ("'", '"'):
                in_str = c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return src[start:i]
        i += 1
    raise ValueError("unbalanced array literal for " + decl)


def split_objects(body):
    """Split a JS array body into top-level {...} object source strings."""
    objs, cur, depth, in_str, esc = [], [], 0, None, False
    for c in body:
        if in_str:
            cur.append(c)
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == in_str:
                in_str = None
        elif c in ("'", '"'):
            in_str = c
            cur.append(c)
        elif c == "{":
            depth += 1
            cur.append(c)
        elif c == "}":
            depth -= 1
            cur.append(c)
            if depth == 0:
                objs.append("".join(cur))
                cur = []
        elif depth > 0:
            cur.append(c)
    return objs


def field(obj, key, idx):
    """Extract `key: 'string' | null` from ONE object body only."""
    m = re.search(r"(?<![A-Za-z0-9_])" + key + r"\s*:\s*(?:'((?:[^'\\]|\\.)*)'|(null))", obj)
    if not m:
        fails.append("reveal[%d]: missing or malformed field %r" % (idx, key))
        return None
    if m.group(2) == "null":
        return None
    return m.group(1)


ledger = json.loads(LEDGER.read_text(encoding="utf-8"))
rows = [(r.get("wave"), r.get("sha")) for r in ledger["rows"]]

js = THEATER.read_text(encoding="utf-8")
reveal_objs = split_objects(extract_array(js, "var REVEAL_MAP"))
reveals = [(field(o, "wave", i), field(o, "sha", i)) for i, o in enumerate(reveal_objs)]

# 1. count parity
if len(reveals) != len(rows):
    fails.append("count mismatch: %d reveal windows vs %d ledger rows" % (len(reveals), len(rows)))
else:
    # 2. order parity (wave + sha, row for row)
    for i, ((rw, rs), (lw, ls)) in enumerate(zip(reveals, rows)):
        if rw != lw:
            fails.append("reveal[%d] wave %r != ledger %r" % (i, rw, lw))
        if (rs or None) != (ls or None):
            fails.append("reveal[%d] sha %r != ledger %r" % (i, rs, ls))

# 3. every ledger sha is a real commit in git history
for wave, sha in rows:
    if not sha:
        continue
    t = subprocess.run(["git", "cat-file", "-t", sha], cwd=ROOT, capture_output=True, text=True)
    if t.returncode != 0 or t.stdout.strip() != "commit":
        fails.append("ledger sha %s (%s) not a commit in git history" % (sha, wave))

# 4. runtime BT-1 assert is wired at init (defense in depth for the browser path)
if "assertBT1(" not in js or "window.__BT_1_ASSERT_OK" not in js:
    fails.append("theater.js runtime assertBT1 wiring missing")

if fails:
    print("BT-1 LEDGER-REVEAL SYNC: FAIL")
    for f in fails:
        print("  X", f)
    sys.exit(1)
print("BT-1 LEDGER-REVEAL SYNC: PASS — %d windows == %d rows, order identical, all %d shas resolve in git history, runtime assert wired"
      % (len(reveals), len(rows), sum(1 for _, s in rows if s)))
