import fs from 'node:fs';
import path from 'node:path';
import {
  fitProjection,
  slabOf,
  cylinder,
  insetPlan,
  planOutline,
  lineOnTop,
  segment,
  rise,
  ring,
  dotGrid,
  corners,
  boxCorners,
  knurl,
  coil,
  topTicks,
  radialTicks,
  translateAlong,
  topMatrix,
  sideMatrix,
  solidSvg,
  lineSvg,
  dotsSvg,
  wireSvg,
  faceTextSvg,
  groupSvg,
  figureSvg,
  plateHtml,
  iso,
  ISO_CSS
} from '/Users/tamld/.gemini/skills/anatomy/kit/iso-kit.mjs';

const ROOT = '/Users/tamld/Documents/github/tamld.github.io';

// ============================================================================
// FIG 1: SYMBIOTIC DUAL-PLANE BARE-METAL & AI CONSTELLATION TEST BENCH (HUB)
// ============================================================================
function buildHubRig(standalone = true) {
  const W = 760, H = 430;
  const basePlan = { x: 0, y: 0, w: 220, d: 136, r: 8 };
  const P = fitProjection(boxCorners(basePlan, -8, 52), W, H, { pad: 24, azimuth: 42, elevation: 30 });

  const parts = [];

  // 1. 4 Heavy Rubber Feet under baseplate
  for (const [fx, fy] of corners(basePlan, 12)) {
    parts.push(solidSvg(cylinder(fx, fy, 6, -5, 5, P, 24), { tone: 'lo' }));
  }

  // 2. Main Machined Baseplate + Recessed Deck + Ruler Ticks + Corner Screws
  parts.push(solidSvg(slabOf(basePlan, 0, 8, P, 8, 1.2), { tone: 'mid', halo: true }));
  const deckPlan = insetPlan(basePlan, 6);
  parts.push(lineSvg(planOutline(deckPlan, 8, P, 6), { tone: 'faint' }));

  const ticksX = topTicks(14, 206, 4, 5, 128, 8, [2.2, 4.5], P, 'x');
  const ticksY = topTicks(14, 122, 4, 5, 8, 8, [2.2, 4.5], P, 'y');
  parts.push(lineSvg(ticksX.minor + ticksY.minor, { tone: 'faint' }));
  parts.push(lineSvg(ticksX.major + ticksY.major, { tone: 'lo' }));

  const screwPts = corners(basePlan, 10).map(([sx, sy]) => iso([sx, sy, 8.2], P));
  parts.push(dotsSvg(screwPts, { size: 1.6, tone: 'hi' }));

  // Engraved deck labels
  parts.push(faceTextSvg(topMatrix([16, 123], 8.1, P, 'x'), 'DUAL-PLANE SUBSTRATE // ZERO-WAN EXPOSURE // 16GB HARD BUDGET', { size: 3.1, tone: 'mid' }));
  parts.push(faceTextSvg(sideMatrix([16, 136], 5.5, P, 'left'), 'FLOWAXON-RIG-01 // PVE-NODE-01 // 770KB-RSS-GO-ENGINE', { size: 3.0, tone: 'hi' }));

  // 3. Stage A (Left): Cloudflare Edge Anycast Transceiver Pedestal + Dish
  const edgePad = { x: 14, y: 34, w: 38, d: 68, r: 4 };
  parts.push(solidSvg(slabOf(edgePad, 8, 5, P, 6, 0.6), { tone: 'mid', className: 'rig-part rig-edge' }));
  parts.push(solidSvg(cylinder(33, 68, 13, 13, 8, P, 28, 0.8), { tone: 'hi', lit: true, className: 'rig-part rig-edge' }));
  parts.push(lineSvg(knurl(33, 68, 13, 13, 21, 24, P, 0.8), { tone: 'lo' }));
  parts.push(solidSvg(cylinder(33, 68, 7, 21, 9, P, 24, 0.5), { tone: 'hi', lit: true }));
  parts.push(lineSvg(ring(33, 68, 16, 13.2, P, 36), { tone: 'blue', dashed: true }));
  parts.push(faceTextSvg(topMatrix([18, 96], 13.2, P, 'x'), 'L1 EDGE mTLS', { size: 2.9, tone: 'hi' }));

  // 4. Stage B (Center-Left): Traefik v3 Gateway Prism & MikroTik RouterOS Single-Authority Rack
  const traefikPlan = { x: 64, y: 20, w: 42, d: 44, r: 3 };
  parts.push(solidSvg(slabOf(traefikPlan, 8, 16, P, 6, 0.8), { tone: 'hi', className: 'rig-part rig-traefik' }));
  const dialTicks = radialTicks(85, 42, 11, 20, 5, 24.1, [1.5, 3], P);
  parts.push(lineSvg(dialTicks.minor, { tone: 'lo' }));
  parts.push(lineSvg(dialTicks.major, { tone: 'hi' }));
  parts.push(solidSvg(cylinder(85, 42, 6, 24, 5, P, 20, 0.5), { tone: 'hi', lit: true }));
  parts.push(faceTextSvg(topMatrix([68, 59], 24.2, P, 'x'), 'TRAEFIK v3', { size: 2.8, tone: 'hi' }));

  const routerPlan = { x: 64, y: 74, w: 42, d: 44, r: 3 };
  parts.push(solidSvg(slabOf(routerPlan, 8, 12, P, 6, 0.8), { tone: 'mid', className: 'rig-part rig-router' }));
  parts.push(dotsSvg(dotGrid(70, 82, 6, 2, 5, 20.2, P), { size: 1.1, tone: 'hi', pulse: true }));
  parts.push(faceTextSvg(topMatrix([68, 112], 20.2, P, 'x'), 'ROUTEROS DHCP', { size: 2.7, tone: 'mid' }));

  // 5. Twin Guide Rails + Coiled Springs connecting Gateway to Constellation Core
  const spring1 = coil(106, 124, [42, 16], 3.2, 6, 'x', P);
  const spring2 = coil(106, 124, [94, 16], 3.2, 6, 'x', P);
  parts.push(lineSvg(spring1.back + spring2.back, { tone: 'lo' }));
  parts.push(lineSvg(segment([106, 42, 16], [124, 42, 16], P) + segment([106, 94, 16], [124, 94, 16], P), { tone: 'hi' }));
  parts.push(lineSvg(spring1.front + spring2.front, { tone: 'mid' }));

  // 6. Stage C (Right): Proxmox VE Hypervisor Bridge & Dual Containment Chambers (g8s + Aegis)
  const pveBase = { x: 124, y: 18, w: 82, d: 100, r: 5 };
  parts.push(solidSvg(slabOf(pveBase, 8, 6, P, 8, 0.8), { tone: 'mid' }));

  // Pod 1: g8s Containment Chamber (Back-Right)
  const g8sPlan = { x: 130, y: 24, w: 70, d: 40, r: 4 };
  parts.push(solidSvg(slabOf(g8sPlan, 14, 14, P, 6, 0.9), { tone: 'hi', lit: true, className: 'rig-part rig-g8s' }));
  parts.push(solidSvg(cylinder(165, 44, 10, 28, 6, P, 24, 0.6), { tone: 'hi', lit: true }));
  parts.push(lineSvg(ring(165, 44, 13, 28.2, P, 32), { tone: 'green', flow: true }));
  parts.push(faceTextSvg(topMatrix([134, 59], 28.2, P, 'x'), 'L2: g8s HARNESS (F0/F1/F2)', { size: 2.6, tone: 'hi' }));

  // Pod 2: Aegis AST & Telegram 2FA Guardrail Chamber (Front-Right)
  const aegisPlan = { x: 130, y: 72, w: 70, d: 40, r: 4 };
  parts.push(solidSvg(slabOf(aegisPlan, 14, 14, P, 6, 0.9), { tone: 'hi', lit: true, className: 'rig-part rig-aegis' }));
  parts.push(solidSvg(cylinder(152, 92, 8, 28, 7, P, 24, 0.5), { tone: 'hi', lit: true }));
  parts.push(solidSvg(slabOf({ x: 170, y: 80, w: 22, d: 24, r: 2 }, 28, 4, P, 4, 0.4), { tone: 'mid' }));
  parts.push(lineSvg(ring(152, 92, 11, 28.2, P, 32), { tone: 'red', flow: true }));
  parts.push(faceTextSvg(topMatrix([134, 107], 28.2, P, 'x'), 'L3: AEGIS AST + 2FA HITL', { size: 2.6, tone: 'hi' }));

  // 7. Animated Packet Flow Wires (Edge -> Traefik -> g8s / Aegis & RouterOS)
  parts.push(wireSvg(iso([46, 56, 17], P), iso([64, 42, 17], P), { tone: 'blue', flow: true, size: 1.5 }));
  parts.push(wireSvg(iso([46, 78, 17], P), iso([64, 92, 17], P), { tone: 'green', flow: true, size: 1.5 }));
  parts.push(wireSvg(iso([106, 36, 20], P), iso([130, 40, 22], P), { tone: 'blue', flow: true, size: 1.5 }));
  parts.push(wireSvg(iso([106, 98, 18], P), iso([130, 92, 22], P), { tone: 'red', flow: true, size: 1.5 }));
  parts.push(wireSvg(iso([85, 64, 16], P), iso([85, 74, 16], P), { tone: 'hi', dotted: true, size: 1.3 }));

  const svg = figureSvg({
    width: W,
    height: H,
    label: 'Fig 01: Symbiotic Dual-Plane Bare-Metal & AI Constellation Test Rig',
    body: parts,
    standalone
  });

  const plate = plateHtml({
    fig: 'FIG 01 // CONSTELLATION-RIG',
    title: 'DUAL-PLANE BARE-METAL & AI HARNESS BENCH',
    hint: 'CLICK LAYER CARRIAGES OR RUN /DRILL IN TERMINAL',
    readout: 'RSS 770KB • WAN/LAN 100% • TLS 1.3 mTLS',
    keys: [
      { mark: 'lit', label: 'Active Containment Core (g8s / Aegis)' },
      { mark: 'blue', label: 'Cloudflare mTLS Ingress Stream' },
      { mark: 'green', label: 'WriteReceipt Verified Path' },
      { mark: 'red', label: 'AST Risk / HITL 2FA Intercept' }
    ],
    caption: 'Every incoming request traverses Cloudflare Full-Strict mTLS into Traefik v3 and MikroTik RouterOS (Single DHCP Authority), routing isolated workloads into g8s (WriteReceipt worktrees) and Aegis (Shell AST + Telegram 2FA).',
    body: svg
  });

  return { svg, plate };
}

// ============================================================================
// FIG 2: g8s F0/F1/F2 CONCENTRIC CONTAINMENT LOCK & WRITERECEIPT PRESS
// ============================================================================
function buildG8sRig(standalone = true) {
  const W = 760, H = 420;
  const basePlan = { x: 0, y: 0, w: 210, d: 132, r: 8 };
  const P = fitProjection(boxCorners(basePlan, -6, 56), W, H, { pad: 24, azimuth: 44, elevation: 31 });

  const parts = [];

  for (const [fx, fy] of corners(basePlan, 12)) {
    parts.push(solidSvg(cylinder(fx, fy, 5.5, -5, 5, P, 20), { tone: 'lo' }));
  }

  parts.push(solidSvg(slabOf(basePlan, 0, 8, P, 8, 1.1), { tone: 'mid', halo: true }));
  const ticks = topTicks(14, 196, 4, 5, 124, 8, [2, 4.2], P, 'x');
  parts.push(lineSvg(ticks.minor, { tone: 'faint' }));
  parts.push(lineSvg(ticks.major, { tone: 'lo' }));
  parts.push(dotsSvg(corners(basePlan, 10).map(([x, y]) => iso([x, y, 8.2], P)), { size: 1.5, tone: 'hi' }));

  parts.push(faceTextSvg(topMatrix([14, 119], 8.1, P, 'x'), 'ZERO-TRUST CAPABILITY DELEGATION // 1 ISSUE = 1 WORKER = 1 RECEIPT', { size: 2.9, tone: 'mid' }));
  parts.push(faceTextSvg(sideMatrix([14, 132], 5.5, P, 'left'), 'G8S-VAULT-v0.21.0 // F0-F1-F2 // S0..S3 STRATA', { size: 3.0, tone: 'hi' }));

  // Left: Orthogonal Control Strata Selector Bank (S1, S2, S3-M, S3-A)
  const bankPlan = { x: 14, y: 20, w: 54, d: 92, r: 4 };
  parts.push(solidSvg(slabOf(bankPlan, 8, 8, P, 6, 0.7), { tone: 'mid' }));
  const strataLabels = ['S1 COORD', 'S2 GOV', 'S3-M MUT', 'S3-A ADJ'];
  for (let i = 0; i < 4; i++) {
    const sy = 26 + i * 20;
    const isLit = i === 2;
    parts.push(solidSvg(slabOf({ x: 20, y: sy, w: 42, d: 14, r: 2 }, 16, isLit ? 7 : 4, P, 4, 0.4), { tone: isLit ? 'hi' : 'mid', lit: isLit }));
    parts.push(faceTextSvg(topMatrix([24, sy + 10], isLit ? 23.2 : 20.2, P, 'x'), strataLabels[i], { size: 2.5, tone: isLit ? 'hi' : 'mid' }));
  }

  // Center-Right: Concentric F0 -> F1 -> F2 Containment Rings & Hydraulic Receipt Press
  const cx = 138, cy = 66;
  // Outer Ring: F2 Subagent Sandbox
  parts.push(solidSvg(cylinder(cx, cy, 44, 8, 7, P, 44, 0.9), { tone: 'mid' }));
  const rTicks = radialTicks(cx, cy, 42, 36, 3, 15.1, [2, 4], P);
  parts.push(lineSvg(rTicks.minor, { tone: 'faint' }));
  parts.push(lineSvg(rTicks.major, { tone: 'lo' }));

  // Middle Ring: F1 Isolated Git Worktree & CAS Lease
  parts.push(solidSvg(cylinder(cx, cy, 30, 15, 9, P, 36, 0.8), { tone: 'hi', lit: true }));
  parts.push(lineSvg(knurl(cx, cy, 30, 15, 24, 32, P, 1.0), { tone: 'lo' }));
  parts.push(lineSvg(ring(cx, cy, 26, 24.2, P, 36), { tone: 'green', flow: true }));

  // Inner Core: F0 Sovereign Brain & WriteReceipt Stamp Plunger
  parts.push(solidSvg(cylinder(cx, cy, 16, 24, 12, P, 28, 0.7), { tone: 'hi', lit: true }));
  parts.push(solidSvg(cylinder(cx, cy, 8, 36, 10, P, 24, 0.6), { tone: 'hi', lit: true }));
  parts.push(lineSvg(knurl(cx, cy, 8, 36, 46, 18, P, 0.8), { tone: 'mid' }));

  // Overhead Gantry Arch holding the Receipt Press
  parts.push(solidSvg(slabOf({ x: cx - 6, y: 14, w: 12, d: 12, r: 2 }, 8, 38, P, 4, 0.5), { tone: 'mid' }));
  parts.push(solidSvg(slabOf({ x: cx - 6, y: 106, w: 12, d: 12, r: 2 }, 8, 38, P, 4, 0.5), { tone: 'mid' }));
  parts.push(solidSvg(slabOf({ x: cx - 8, y: 12, w: 16, d: 108, r: 3 }, 46, 6, P, 6, 0.6), { tone: 'hi' }));
  parts.push(faceTextSvg(topMatrix([cx - 4, 95], 52.2, P, 'y'), 'WRITERECEIPT SHA256 PRESS', { size: 2.7, tone: 'hi' }));

  // Wires from Strata Selector Bank into Containment Vault
  parts.push(wireSvg(iso([62, 72, 22], P), iso([96, 66, 18], P), { tone: 'green', flow: true, size: 1.5 }));
  parts.push(wireSvg(iso([62, 32, 19], P), iso([102, 42, 15], P), { tone: 'red', dashed: true, size: 1.4 }));

  const svg = figureSvg({
    width: W,
    height: H,
    label: 'Fig 02: g8s F0/F1/F2 Concentric Containment Vault & WriteReceipt Press',
    body: parts,
    standalone
  });

  const plate = plateHtml({
    fig: 'FIG 02 // G8S-CONTAINMENT-RIG',
    title: 'CONCENTRIC F0/F1/F2 RINGS × S0..S3 STRATUM LOCK',
    hint: 'TEST PRESETS BELOW TO ACTUATE STRATUM FIREWALL GATES',
    readout: 'CARDINALITY 1:1:1 • F1↔F1 = 0 • CAS WAL',
    keys: [
      { mark: 'lit', label: 'F0 Brain / F1 Worktree CAS Lease' },
      { mark: 'green', label: 'S3-M AllowedPaths Receipt Channel' },
      { mark: 'red', label: 'S1/S3-A Mutation Firewall Block' }
    ],
    caption: 'The g8s harness physically isolates every worker inside an ephemeral Git worktree and OS process group (Setpgid), stamping a single-use WriteReceipt before any file mutation can occur.',
    body: svg
  });

  return { svg, plate };
}

// ============================================================================
// FIG 3: AEGIS 3-STAGE SHELL AST LASER & TELEGRAM 2FA BLAST DOOR
// ============================================================================
function buildAegisRig(standalone = true) {
  const W = 760, H = 420;
  const basePlan = { x: 0, y: 0, w: 220, d: 132, r: 8 };
  const P = fitProjection(boxCorners(basePlan, -6, 54), W, H, { pad: 24, azimuth: 43, elevation: 30 });

  const parts = [];

  for (const [fx, fy] of corners(basePlan, 12)) {
    parts.push(solidSvg(cylinder(fx, fy, 5.5, -5, 5, P, 20), { tone: 'lo' }));
  }

  parts.push(solidSvg(slabOf(basePlan, 0, 8, P, 8, 1.1), { tone: 'mid', halo: true }));
  const ticks = topTicks(14, 206, 4, 5, 124, 8, [2, 4.2], P, 'x');
  parts.push(lineSvg(ticks.minor, { tone: 'faint' }));
  parts.push(lineSvg(ticks.major, { tone: 'lo' }));
  parts.push(dotsSvg(corners(basePlan, 10).map(([x, y]) => iso([x, y, 8.2], P)), { size: 1.5, tone: 'hi' }));

  parts.push(faceTextSvg(topMatrix([14, 119], 8.1, P, 'x'), 'DEFENSE-IN-DEPTH // SHELL AST FIREWALL // HMAC-SHA256 TELEGRAM HITL', { size: 2.9, tone: 'mid' }));
  parts.push(faceTextSvg(sideMatrix([14, 132], 5.5, P, 'left'), 'AEGIS-GUARD-v1.4.0 // SIGSTOP BLAST DOOR // 8-GATE DLP', { size: 3.0, tone: 'hi' }));

  // Stage 1 (Left): Shell AST Laser Spectrometer & Risk Dial Gauge (0..100)
  const astPlan = { x: 16, y: 28, w: 52, d: 76, r: 4 };
  parts.push(solidSvg(slabOf(astPlan, 8, 12, P, 6, 0.8), { tone: 'hi', lit: true }));
  parts.push(solidSvg(cylinder(42, 66, 16, 20, 6, P, 32, 0.6), { tone: 'hi', lit: true }));
  const gaugeTicks = radialTicks(42, 66, 14, 24, 4, 26.2, [1.8, 3.5], P);
  parts.push(lineSvg(gaugeTicks.minor, { tone: 'lo' }));
  parts.push(lineSvg(gaugeTicks.major, { tone: 'red' }));
  // Gauge needle pointing to 94/100
  parts.push(lineSvg(lineOnTop([42, 66], [52, 58], 26.4, P), { tone: 'red' }));
  parts.push(faceTextSvg(topMatrix([20, 98], 20.2, P, 'x'), 'L1: AST RISK 94/100', { size: 2.7, tone: 'hi' }));

  // Coiled Laser Conduit from Stage 1 to Stage 2 Blast Door
  const spA = coil(68, 92, [66, 16], 4, 7, 'x', P);
  parts.push(lineSvg(spA.back, { tone: 'lo' }));
  parts.push(lineSvg(segment([68, 66, 16], [92, 66, 16], P), { tone: 'red', flow: true }));
  parts.push(lineSvg(spA.front, { tone: 'mid' }));

  // Stage 2 (Center): SIGSTOP Pneumatic Blast Door & Telegram 2FA Relay Tower
  const doorBase = { x: 92, y: 22, w: 52, d: 88, r: 4 };
  parts.push(solidSvg(slabOf(doorBase, 8, 8, P, 6, 0.7), { tone: 'mid' }));
  // Twin vertical blast door pillars + locked gate slab
  parts.push(solidSvg(slabOf({ x: 98, y: 28, w: 12, d: 14, r: 2 }, 16, 26, P, 4, 0.5), { tone: 'hi' }));
  parts.push(solidSvg(slabOf({ x: 98, y: 90, w: 12, d: 14, r: 2 }, 16, 26, P, 4, 0.5), { tone: 'hi' }));
  parts.push(solidSvg(slabOf({ x: 100, y: 42, w: 8, d: 48, r: 1 }, 16, 22, P, 4, 0.5), { tone: 'hi', lit: true }));
  // Telegram 2FA Transceiver Tower behind gate
  parts.push(solidSvg(cylinder(128, 66, 11, 16, 22, P, 24, 0.6), { tone: 'hi', lit: true }));
  parts.push(lineSvg(knurl(128, 66, 11, 16, 38, 20, P, 0.8), { tone: 'lo' }));
  parts.push(lineSvg(ring(128, 66, 15, 38.2, P, 32), { tone: 'blue', flow: true }));
  parts.push(faceTextSvg(topMatrix([96, 106], 16.2, P, 'x'), 'L2: SIGSTOP + TG 2FA', { size: 2.6, tone: 'hi' }));

  // Stage 3 (Right): 8-Gate Zero-Leakage DLP & VictoriaLogs Audit Core
  const dlpPlan = { x: 158, y: 26, w: 48, d: 80, r: 4 };
  parts.push(solidSvg(slabOf(dlpPlan, 8, 14, P, 6, 0.8), { tone: 'mid' }));
  parts.push(dotsSvg(dotGrid(166, 36, 4, 6, 8, 22.2, P), { size: 1.2, tone: 'hi', pulse: true }));
  parts.push(faceTextSvg(topMatrix([162, 100], 22.2, P, 'x'), 'L3: 8-GATE DLP LOCK', { size: 2.6, tone: 'hi' }));

  parts.push(wireSvg(iso([144, 66, 20], P), iso([158, 66, 20], P), { tone: 'green', flow: true, size: 1.5 }));

  const svg = figureSvg({
    width: W,
    height: H,
    label: 'Fig 03: Aegis 3-Stage Shell AST Spectrometer & Telegram 2FA Blast Door',
    body: parts,
    standalone
  });

  const plate = plateHtml({
    fig: 'FIG 03 // AEGIS-DEFENSE-RIG',
    title: 'SHELL AST SPECTROMETER & SIGSTOP 2FA BLAST DOOR',
    hint: 'SELECT AN ATTACK VECTOR BELOW TO TEST BLAST DOOR INTERCEPTION',
    readout: 'AST < 5ms • SIGSTOP ARMED • HMAC-SHA256',
    keys: [
      { mark: 'red', label: 'High-Risk AST Score (≥ 70 -> SIGSTOP)' },
      { mark: 'blue', label: 'Signed Telegram 2FA Callback Channel' },
      { mark: 'green', label: '8-Gate DLP Verified Execution' }
    ],
    caption: 'Every agent shell command is tokenized in <5ms by the L1 AST Spectrometer. Commands scoring ≥70 drop the L2 SIGSTOP Blast Door and require a signed HMAC-SHA256 Telegram 2FA callback from the human operator.',
    body: svg
  });

  return { svg, plate };
}

const cleanCsp = (s) => s.replace(/ style="--pulse-at:[0-9]+ms"/g, '');

const hub = buildHubRig(true);
const g8s = buildG8sRig(true);
const aegis = buildAegisRig(true);

fs.writeFileSync(path.join(ROOT, 'assets/diagrams/arch-dualplane-topology.svg'), cleanCsp(hub.svg));
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/g8s-containment-anatomy.svg'), cleanCsp(g8s.svg));
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/aegis-defense-layers.svg'), cleanCsp(aegis.svg));

fs.mkdirSync(path.join(ROOT, 'assets/diagrams/plates'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/plates/hub-plate.html'), cleanCsp(buildHubRig(false).plate));
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/plates/g8s-plate.html'), cleanCsp(buildG8sRig(false).plate));
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/plates/aegis-plate.html'), cleanCsp(buildAegisRig(false).plate));
fs.writeFileSync(path.join(ROOT, 'assets/diagrams/plates/iso.css'), ISO_CSS);

console.log('Generated 3D Isometric Anatomy rigs:', {
  hubSvgBytes: hub.svg.length,
  g8sSvgBytes: g8s.svg.length,
  aegisSvgBytes: aegis.svg.length
});
