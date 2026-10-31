import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = '/Users/tamld/Documents/github/tamld.github.io';

const hubPlate = fs.readFileSync(path.join(ROOT, 'assets/diagrams/plates/hub-plate.html'), 'utf8');
const g8sPlate = fs.readFileSync(path.join(ROOT, 'assets/diagrams/plates/g8s-plate.html'), 'utf8');
const aegisPlate = fs.readFileSync(path.join(ROOT, 'assets/diagrams/plates/aegis-plate.html'), 'utf8');

const CMDK_MODAL = `
  <!-- GLOBAL CMD+K COMMAND PALETTE MODAL (L3 GLASS OVERLAY) -->
  <div id="cmdk-modal" class="cmdk-backdrop hidden" role="dialog" aria-modal="true" aria-label="FlowAxon Command Palette">
    <div class="cmdk-dialog font-mono">
      <div class="px-4 py-3 border-b border-borderHairline flex items-center justify-between text-xs text-zinc-400">
        <span>⌘K FlowAxon Constellation Launcher</span>
        <button type="button" data-cmdk-close="1" class="px-2 py-0.5 rounded bg-panel border border-borderHairline text-zinc-300 hover:text-white">ESC</button>
      </div>
      <div class="p-2 space-y-1">
        <div class="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-500">Product Constellation Domains</div>
        <a href="https://flowaxon.com" class="cmdk-item">
          <span>🌐 flowaxon.com — Executive Dossier &amp; Dual-Plane Hub</span>
          <span class="text-[11px] text-accentLight">Hub ↵</span>
        </a>
        <a href="https://g8s.flowaxon.com" class="cmdk-item">
          <span>🛡️ g8s.flowaxon.com — Zero-Trust AI Agent Capability Harness (v0.21.0)</span>
          <span class="text-[11px] text-signalGreen">Product 1 ↵</span>
        </a>
        <a href="https://aegis.flowaxon.com" class="cmdk-item">
          <span>🚨 aegis.flowaxon.com — Shell AST &amp; Telegram 2FA Runtime Guardrail (v1.4.0)</span>
          <span class="text-[11px] text-rose-400">Product 2 ↵</span>
        </a>
        <div class="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-zinc-500">Machine-Readable SSoT &amp; DevSecOps Proofs</div>
        <a href="/manifest.json" class="cmdk-item">
          <span>📄 /manifest.json — SSoT Architecture, BA Storytelling &amp; 6-Stage CI/CD Manifest</span>
          <span class="text-[11px] text-zinc-400">JSON ↵</span>
        </a>
        <a href="/llms.txt" class="cmdk-item">
          <span>🤖 /llms.txt — AI Agent Context Index (llmstxt.org Standard)</span>
          <span class="text-[11px] text-zinc-400">Markdown ↵</span>
        </a>
        <a href="https://github.com/tamld/flowaxon" target="_blank" rel="noopener noreferrer" class="cmdk-item">
          <span>📦 github.com/tamld/flowaxon — Source Code &amp; 6-Stage DevSecOps Pipeline</span>
          <span class="text-[11px] text-zinc-400">GitHub ↗</span>
        </a>
      </div>
    </div>
  </div>
`;

const PERSONA_BAR = `
    <!-- BA STAKEHOLDER & READER SELF-SEGMENTATION ROUTER (v3.0) -->
    <section id="persona-router" class="p-4 sm:p-5 rounded-lg bg-panel border border-borderSubtle space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="px-2 py-0.5 rounded bg-[#0c1926] border border-[#14324f] text-accentLight font-bold">BA LENS</span>
          <span class="text-zinc-300">Select your stakeholder role to tailor proof points:</span>
        </div>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Stakeholder Persona Filter">
          <button type="button" data-persona-filter="cto" class="persona-pill active">1. CTO / VP Engineering</button>
          <button type="button" data-persona-filter="sre" class="persona-pill">2. Principal SRE &amp; SecOps</button>
          <button type="button" data-persona-filter="builder" class="persona-pill">3. AI Agent Builder</button>
          <button type="button" data-persona-filter="agent" class="persona-pill">4. WebMCP / AI Agent</button>
        </div>
      </div>
      <div class="p-3.5 rounded bg-black border border-borderHairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div id="persona-lens-badge" class="text-[10px] font-mono uppercase tracking-wider text-signalGreen">CTO / VP OF ENGINEERING LENS</div>
          <div id="persona-lens-headline" class="text-sm sm:text-base font-bold text-white">Zero-Quota-Burn AI Delegation + Deterministic Production Governance</div>
          <p id="persona-lens-summary" class="text-xs text-zinc-400 leading-relaxed">See how g8s eliminates frontier F0 Brain quota waste (0% coordinator burn via 9router worker fan-out) while Aegis enforces HMAC-SHA256 human-in-the-loop blast doors on production infrastructure.</p>
        </div>
        <a id="persona-lens-cta" href="#anatomy" class="shrink-0 px-3.5 py-2 rounded bg-[#0c1926] border border-[#14324f] text-accentLight hover:text-white font-mono text-xs">Inspect 3D Constellation Rig ↓</a>
      </div>
    </section>
`;

// 1. Update index.html
let indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Add ⌘K button in header if not present
if (!indexHtml.includes('data-cmdk-toggle')) {
  indexHtml = indexHtml.replace(
    '<a href="/llms.txt"',
    '<button type="button" data-cmdk-toggle="1" class="px-2.5 py-1 rounded bg-panel border border-borderSubtle text-zinc-200 hover:border-accentLight transition-colors font-mono text-xs" title="Open Command Palette (Cmd+K)">⌘K</button>\n        <a href="/llms.txt"'
  );
}

// Add BA Persona Router right before Operating Substrate section if not present
if (!indexHtml.includes('id="persona-router"')) {
  indexHtml = indexHtml.replace(
    '<!-- REAL MONOCHROME TECH SUBSTRATE -->',
    `${PERSONA_BAR}\n\n    <!-- REAL MONOCHROME TECH SUBSTRATE -->`
  );
}

// Replace flat 2D #iso-svg-rig block or existing .iso-figure with the 3D Isometric Anatomy Hub Plate
indexHtml = indexHtml.replace(
  /<div class="p-3 rounded bg-black border border-borderHairline overflow-x-auto">\s*<svg id="iso-svg-rig"[\s\S]*?<\/svg>\s*<\/div>|<div class="iso overflow-x-auto"><figure class="iso-figure">[\s\S]*?<\/figure><\/div>/,
  `<div class="iso overflow-x-auto">${hubPlate}</div>`
);

// Add CMDK_MODAL before </body>
if (!indexHtml.includes('id="cmdk-modal"')) {
  indexHtml = indexHtml.replace('</body>', `${CMDK_MODAL}\n</body>`);
}

// 2. Update sites/g8s.html
let g8sHtml = fs.readFileSync(path.join(ROOT, 'sites/g8s.html'), 'utf8');
if (!g8sHtml.includes('data-cmdk-toggle')) {
  g8sHtml = g8sHtml.replace(
    '<span class="px-2 py-0.5 rounded bg-[#091f15] border border-signalGreen text-signalGreen">SSE LIVE</span>',
    '<button type="button" data-cmdk-toggle="1" class="px-2.5 py-0.5 rounded bg-panel border border-borderSubtle text-zinc-200 hover:border-accentLight">⌘K</button>\n        <span class="px-2 py-0.5 rounded bg-[#091f15] border border-signalGreen text-signalGreen">SSE LIVE</span>'
  );
}
g8sHtml = g8sHtml.replace(
  /<div class="p-3 rounded(?:-lg)? bg-black border border-borderHairline overflow-x-auto">\s*<img src="\/assets\/diagrams\/g8s-containment-anatomy\.svg"[\s\S]*?<\/div>|<div class="iso overflow-x-auto"><figure class="iso-figure">[\s\S]*?<\/figure><\/div>/,
  `<div class="iso overflow-x-auto">${g8sPlate}</div>`
);
if (!g8sHtml.includes('id="cmdk-modal"')) {
  g8sHtml = g8sHtml.replace('</body>', `${CMDK_MODAL}\n</body>`);
}

// 3. Update sites/aegis.html
let aegisHtml = fs.readFileSync(path.join(ROOT, 'sites/aegis.html'), 'utf8');
if (!aegisHtml.includes('data-cmdk-toggle')) {
  aegisHtml = aegisHtml.replace(
    '<span class="px-2 py-0.5 rounded bg-[#091f15] border border-signalGreen text-signalGreen">SSE LIVE</span>',
    '<button type="button" data-cmdk-toggle="1" class="px-2.5 py-0.5 rounded bg-panel border border-borderSubtle text-zinc-200 hover:border-rose-400">⌘K</button>\n        <span class="px-2 py-0.5 rounded bg-[#091f15] border border-signalGreen text-signalGreen">SSE LIVE</span>'
  );
}
aegisHtml = aegisHtml.replace(
  /<div class="p-3 rounded(?:-lg)? bg-black border border-borderHairline overflow-x-auto">\s*<img src="\/assets\/diagrams\/aegis-defense-layers\.svg"[\s\S]*?<\/div>|<div class="iso overflow-x-auto"><figure class="iso-figure">[\s\S]*?<\/figure><\/div>/,
  `<div class="iso overflow-x-auto">${aegisPlate}</div>`
);
if (!aegisHtml.includes('id="cmdk-modal"')) {
  aegisHtml = aegisHtml.replace('</body>', `${CMDK_MODAL}\n</body>`);
}

// 4. Compute exact SHA-384 SRI hashes for CSS & JS and stamp all 3 HTML files
const cssBytes = fs.readFileSync(path.join(ROOT, 'assets/css/flowaxon.css'));
const jsBytes = fs.readFileSync(path.join(ROOT, 'assets/js/flowaxon.js'));
const cssSri = 'sha384-' + crypto.createHash('sha384').update(cssBytes).digest('base64');
const jsSri = 'sha384-' + crypto.createHash('sha384').update(jsBytes).digest('base64');

function updateSriLinks(html) {
  return html
    .replace(
      /<link rel="stylesheet" href="\/assets\/css\/flowaxon\.css[^"]*" integrity="sha384-[^"]*" crossorigin="anonymous">/,
      `<link rel="stylesheet" href="/assets/css/flowaxon.css?v=3.0.0" integrity="${cssSri}" crossorigin="anonymous">`
    )
    .replace(
      /<script src="\/assets\/js\/flowaxon\.js[^"]*" integrity="sha384-[^"]*" crossorigin="anonymous" defer><\/script>/,
      `<script src="/assets/js/flowaxon.js?v=3.0.0" integrity="${jsSri}" crossorigin="anonymous" defer></script>`
    );
}

fs.writeFileSync(path.join(ROOT, 'index.html'), updateSriLinks(indexHtml));
fs.writeFileSync(path.join(ROOT, 'sites/g8s.html'), updateSriLinks(g8sHtml));
fs.writeFileSync(path.join(ROOT, 'sites/aegis.html'), updateSriLinks(aegisHtml));

console.log('Injected v3.0 3D Isometric Anatomy plates, Persona Router, Cmd+K modal, and SRI hashes:', { cssSri, jsSri });
