#!/usr/bin/env python3
"""'The Harness' score v2 — real music bed + frame-aligned Foley.
96 BPM, D minor. Bars align to scene cuts: bar7 downbeat = 15.0s (drop),
bar24 downbeat = 60.0s (end card). All foley computed from the SAME frame
constants as Harness.tsx — audio and picture cannot drift."""
import numpy as np, wave, os

SR = 48000
FPS = 30.0
DUR = 66.0
N = int(DUR * SR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(20261101)
OUT = "/tmp/fxv5/sound"
os.makedirs(OUT, exist_ok=True)

BPM = 96.0
BEAT = 60.0 / BPM          # 0.625 s
BAR = 4 * BEAT             # 2.5 s
def f2s(f): return f / FPS

# frame constants (must match Harness.tsx)
M2_START = 450             # 15.0 s — bar 7 downbeat
M3_START = 1238            # 41.27 s
GATE_FRAMES = [840 + 60 * i for i in range(6)]   # abs frames of gate chip pops
TYPE_START, TYPE_END = 540, 1220                 # typing window (clacks)
LEDGER_FRAMES = [1240 + 55 * i for i in range(6)]  # ledger row reveals
ENDCARD = 1800             # 60.0 s — bar 24 downbeat
VO_SPANS = [(2.0, 12.13), (16.0, 37.12), (41.33, 60.79)]  # duck bed here

def save(name, x, gain=1.0):
    x = np.clip(x * gain, -1, 1)
    st = np.stack([x, x]).T.astype(np.float32)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print(name, round(len(x) / SR, 2), "s")

def add(buf, start_s, sig, vol):
    i0 = int(start_s * SR)
    if i0 < 0 or i0 >= N: return
    n = min(len(sig), N - i0)
    buf[i0:i0 + n] += sig[:n] * vol

def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def kick(vol_dur=0.30):
    n = int(vol_dur * SR); tt = np.arange(n) / SR
    f = 52 * np.exp(-tt * 26) + 42
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11)

def hat():
    n = int(0.03 * SR); tt = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    x = np.diff(x, prepend=0)  # highpass-ish
    return x * np.exp(-tt * 160)

def bass(freq, dur=0.22):
    n = int(dur * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * tt) + 0.28 * np.sin(2 * np.pi * 2 * freq * tt)) * np.exp(-tt * 9) * env(n, 0.004, 0.05)

def pad(freqs, dur, bright=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        x += np.sin(2 * np.pi * f * tt) + bright * 0.22 * np.sin(2 * np.pi * 2 * f * tt + 0.7)
    return x / len(freqs) * env(n, dur * 0.35, dur * 0.4)

def pluck(freq, dur=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * tt) + 0.35 * np.sin(2 * np.pi * freq * 2.01 * tt)
    return x * np.exp(-tt * 7)

def tick():
    n = int(0.05 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90) + 0.4 * np.sin(2 * np.pi * 3600 * tt) * np.exp(-tt * 130))

def clack(seed):
    r = np.random.default_rng(seed)
    n = int(0.012 * SR); tt = np.arange(n) / SR
    x = r.normal(0, 1, n)
    x = np.convolve(x, np.ones(3) / 3, "same")          # band shape
    x = x - np.convolve(x, np.ones(24) / 24, "same")    # remove rumble
    return x * np.exp(-tt * 420)

# note frequencies
D1, A1, D2, A2 = 36.71, 55.0, 73.42, 110.0
D3, F3, A3, BB2, C3, E3, G3 = 146.83, 174.61, 220.0, 116.54, 130.81, 164.81, 196.0
D5, F5, A5, C6, D6, F6 = 587.33, 698.46, 880.0, 1046.5, 1174.7, 1396.9
D4, F4, A4, C5, E5 = 293.66, 349.23, 440.0, 523.25, 659.26

# ───────────────────────── BED (music) ─────────────────────────
bed = np.zeros(N)

# M1 (0-15s, bars 1-6): sub drone D1 + dark Dm pad swells, sparse
add(bed, 0.0, pad([D1], 15.0, 0.3), 0.30)
for b in range(6):
    chord = pad([D3, F3, A3], BAR * 0.96, 0.35) if b % 2 == 0 else pad([D3, A3], BAR * 0.96, 0.3)
    add(bed, b * BAR, chord, 0.16)
    if b in (2, 4):  # sparse pluck echo in the dark
        add(bed, b * BAR + 2 * BEAT, pluck(D5, 0.9), 0.05)

# riser into the drop (bars 5-6)
n = int(2 * BAR * SR); tt = np.arange(n) / SR
sw = rng.normal(0, 1, n)
sw = sw - np.convolve(sw, np.ones(40) / 40, "same")
add(bed, 15.0 - 2 * BAR, sw * np.linspace(0.05, 1, n) * env(n, 0.4, 0.05), 0.20)

# drop @15.0 (bar 7): sub hit + kick enters, four-on-floor through M2
add(bed, 15.0, kick(0.5), 1.0)
for beat_i in range(24, 66):  # beats 24..65 = M2
    tb = beat_i * BEAT
    if beat_i % 4 == 0:
        add(bed, tb, kick(), 0.5)
    if beat_i % 2 == 1:
        add(bed, tb, hat(), 0.11)
    add(bed, tb, bass(D2, 0.20), 0.30)  # driving eighths
# M2 chords per bar: Dm Bb C Dm
for bar_i in range(6, 17):
    prog = [([D3, F3, A3], 0.13), ([BB2, D3, F3], 0.13), ([C3, E3, G3], 0.13), ([D3, F3, A3], 0.13)]
    ch, v = prog[(bar_i - 6) % 4]
    add(bed, bar_i * BAR, pad(ch, BAR * 0.98, 0.55), v)

# M3 (41.27-66, ~bar 17+): resolve — brighter pads, half-note bass walk
m3_bars = (66.0 - f2s(M3_START)) / BAR
chords_m3 = [([D3, F3, A3, D4], 0.14), ([BB2, D3, F3, D4], 0.14), ([F3, A3, C5], 0.14), ([C3, E3, G3, C5], 0.14)]
for k in range(int(m3_bars) + 1):
    tb = f2s(M3_START) + k * BAR
    if tb >= 66.0: break
    ch, v = chords_m3[k % 4]
    add(bed, tb, pad(ch, min(BAR * 0.98, 66.0 - tb), 0.7), v)
for k in range(int(m3_bars * 2) + 1):
    tb = f2s(M3_START) + k * BAR / 2
    if tb >= 59.8: break
    add(bed, tb, bass(D2 if k % 2 == 0 else A1, 0.9), 0.22)
# M3 plucks answering the ledger rows happen in FOLEY; add gentle pad lift to end card
add(bed, 60.0, pad([D3, F3, A3, D5], 6.0, 0.8), 0.17)

# duck bed under VO
duck = np.ones(N)
for a, b in VO_SPANS:
    i0, i1 = int(a * SR), int(b * SR)
    ramp = int(0.18 * SR)
    duck[i0:i0 + ramp] *= np.linspace(1, 0.5, ramp)
    duck[i0 + ramp:i1 - ramp] *= 0.5
    duck[i1 - ramp:i1] *= np.linspace(0.5, 1, ramp)
bed *= duck
save("bed2", bed, 0.85)

# ───────────────────────── FOLEY (frame-aligned) ─────────────────────────
fyl = np.zeros(N)

# typing clacks on the exact typing grid (every 4 frames, 540→1220)
seed = 7700
for fr in range(TYPE_START, TYPE_END, 4):
    seed += 1
    add(fyl, f2s(fr), clack(seed), 0.5)

# gate ticks + ascending seal-ladder notes, exactly on chip pop frames
gates_notes = [D5, F5, A5, C6, D6, F6]
for fr, note in zip(GATE_FRAMES, gates_notes):
    add(fyl, f2s(fr), tick(), 0.85)
    add(fyl, f2s(fr) + 0.02, pluck(note, 0.7), 0.30)

# ledger row plucks (gentle, ascending)
ledger_notes = [D4, F4, A4, C5, E5, D5]
for fr, note in zip(LEDGER_FRAMES, ledger_notes):
    add(fyl, f2s(fr), pluck(note, 1.0), 0.20)

# drop @ frame 450: sub thump + short noise slam
n = int(0.55 * SR); tt = np.arange(n) / SR
thump = np.sin(2 * np.pi * 44 * tt) * np.exp(-tt * 6)
slam = rng.normal(0, 1, int(0.03 * SR)) * np.exp(-np.arange(int(0.03 * SR)) / SR * 90)
add(fyl, 15.0, thump, 0.9)
add(fyl, 15.0, slam, 0.5)

# end card hit @ 60.0: D1 + motif D5-A5-D6 staggered
add(fyl, 60.0, kick(0.5), 0.8)
add(fyl, 60.0, np.sin(2 * np.pi * D1 * np.arange(int(2.0 * SR)) / SR) * env(int(2.0 * SR), 0.01, 1.6), 0.35)
for i, note in enumerate([D5, A5, D6]):
    add(fyl, 60.0 + 0.14 * i, pluck(note, 1.4), 0.30)

# ring-draw swells in M2 opening (three rings, frames 458/485/512)
for i, fr in enumerate([458, 485, 512]):
    n = int(0.4 * SR); tt = np.arange(n) / SR
    add(fyl, f2s(fr), np.sin(2 * np.pi * (220 + 110 * i) * tt) * env(n, 0.25, 0.1), 0.10)

save("foley2", fyl, 0.9)
print("SCORE v2 DONE — 96 BPM, D minor, frame-aligned")
