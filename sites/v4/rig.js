/**
 * sites/v4/rig.js - Vanilla ES6, Zero Dependencies
 * Interactive Constellation Rig Controller (WF4)
 * Deployment map SSoT: manifest.json · Strict DLP
 */
(function () {
  'use strict';

  var isReduced = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  var F_SPECS = {
    'F-01': '3D Isometric Dual-Plane Constellation Rig',
    'F-02': '3-Act Scrollytelling Narrative (48h Crucible -> Determinism -> Symbiotic AI)',
    'F-03': '5-Layer OKLCH Spotlight Bento Constellation Launchpad',
    'F-04': 'Live SSE Telemetry Stream (/api/events) & Dual-Plane SRE Drill (/api/v1/drill)',
    'F-05': 'Global Cmd+K Command Palette & Cross-Subdomain Switcher',
    'F-06': 'W3C WebMCP Tool Registry & /llms.txt Machine Endpoints',
    'F-07': '3D Isometric F0/F1/F2 × S0..S3 Containment Lock Rig',
    'F-08': '3 Target Persona Value Cards (Builder / Architect / Maintainer)',
    'F-09': 'Interactive WriteReceipt & Stratum Firewall Playground (/api/v1/g8s/verify-receipt)',
    'F-10': '4-Stage CLI & MCP Lifecycle Explorer (Triage -> Worker -> Agent I/O -> Blind Verify)',
    'F-11': 'Orthogonal Control Strata Permission Matrix (S1, S2, S3-M, S3-A, O-Plane)',
    'F-12': '3D Isometric AST Laser & Telegram 2FA Blast Door Rig',
    'FM-AEGIS-02': '3 Target Persona Cards (Autonomous SRE / SecOps / Compliance Auditor)',
    'FM-AEGIS-03': 'Interactive Shell AST Risk Analyzer with 0..100 Gauge (/api/v1/aegis/analyze)',
    'FM-AEGIS-04': 'Realistic Telegram Bot 2FA Approval Simulator (HMAC-SHA256 + SIGSTOP/SIGCONT)',
    'FM-AEGIS-05': 'STRIDE + OWASP LLM01/LLM07 Threat Vector Countermeasure Matrix'
  };

  var ENTITIES = {
    edge: {
      id: 'edge', num: '01',
      name: 'Edge — Cloudflare WAF + TLS Termination', shortName: 'Edge',
      what: 'Cloudflare WAF + TLS termination, HSTS preload',
      metric: 'TLS 1.3 · mTLS origin',
      source: 'manifest tech_stack.edge_and_ingress',
      neighbors: ['ingress'],
      fCodes: [{ c: 'F-01', inf: true }, { c: 'F-05', inf: true }]
    },
    ingress: {
      id: 'ingress', num: '02',
      name: 'Ingress — Traefik v3 Reverse Proxy', shortName: 'Ingress',
      what: 'Traefik v3 reverse proxy',
      metric: '3 vhosts',
      source: 'manifest + traefik config docs',
      neighbors: ['edge', 'fleet'],
      fCodes: [{ c: 'F-01', inf: true }, { c: 'F-05', inf: false }]
    },
    fleet: {
      id: 'fleet', num: '03',
      name: 'Fleet — Proxmox LXC + Rootless Podman', shortName: 'Fleet',
      what: 'Proxmox LXC + rootless podman',
      metric: 'production container, distroless',
      source: 'manifest runtime_backend_and_edge_stack',
      neighbors: ['ingress', 'engine'],
      fCodes: [{ c: 'F-02', inf: true }, { c: 'F-03', inf: true }]
    },
    engine: {
      id: 'engine', num: '04',
      name: 'Engine — Static Go Binary', shortName: 'Engine',
      what: 'Static Go binary',
      metric: '864 KB RSS measured 2026-10-31',
      source: 'run #41189766268 era build',
      neighbors: ['fleet', 'harness'],
      fCodes: [{ c: 'F-04', inf: false }, { c: 'F-06', inf: false }, { c: 'F-09', inf: false }, { c: 'FM-AEGIS-03', inf: false }]
    },
    harness: {
      id: 'harness', num: '05',
      name: 'Harness — g8s Controlplane + Aegis Gates', shortName: 'Harness',
      what: 'g8s controlplane + Aegis gates',
      metric: '6-stage pipeline green',
      source: 'github.com/tamld/g8s',
      neighbors: ['engine'],
      fCodes: [
        { c: 'F-07', inf: false }, { c: 'F-08', inf: false }, { c: 'F-10', inf: false },
        { c: 'F-11', inf: false }, { c: 'F-12', inf: false }, { c: 'FM-AEGIS-02', inf: false },
        { c: 'FM-AEGIS-04', inf: false }, { c: 'FM-AEGIS-05', inf: false }
      ]
    }
  };

  var activeId = null;
  var lastFocused = null;

  function renderPopover(entity) {
    var pop = document.getElementById('rig-popover');
    var wrap = document.getElementById('rig-canvas-wrap');
    if (!pop || !entity) return;

    document.getElementById('rig-popover-tag').textContent = 'ENTITY // ' + entity.num;
    document.getElementById('rig-popover-title').textContent = entity.name;
    document.getElementById('rig-popover-what').textContent = entity.what;
    document.getElementById('rig-popover-metric').textContent = entity.metric;
    document.getElementById('rig-popover-source').textContent = '(src: ' + entity.source + ')';

    var chips = document.getElementById('rig-popover-chips');
    chips.innerHTML = '';
    entity.fCodes.forEach(function (fc) {
      var s = document.createElement('span');
      s.className = 'rig-chip';
      s.textContent = fc.c + (fc.inf ? ' (mapping: inferred)' : '');
      s.title = F_SPECS[fc.c] || fc.c;
      chips.appendChild(s);
    });

    pop.removeAttribute('hidden');
    if (wrap) wrap.classList.add('is-dimmed');

    document.querySelectorAll('.rig-node').forEach(function (n) {
      if (n.getAttribute('data-entity') === entity.id) {
        n.classList.add('is-selected');
      } else {
        n.classList.remove('is-selected');
      }
    });

    activeId = entity.id;
    var closeBtn = document.getElementById('rig-popover-close');
    if (closeBtn) closeBtn.focus();
  }

  function closePopover() {
    var pop = document.getElementById('rig-popover');
    var wrap = document.getElementById('rig-canvas-wrap');
    if (!pop || pop.hasAttribute('hidden')) return;

    pop.setAttribute('hidden', '');
    if (wrap) wrap.classList.remove('is-dimmed');

    document.querySelectorAll('.rig-node').forEach(function (n) {
      n.classList.remove('is-selected');
    });

    var prev = activeId;
    activeId = null;

    if (lastFocused) {
      try { lastFocused.focus(); } catch (e) {}
      lastFocused = null;
    } else if (prev) {
      var node = document.querySelector('.rig-node[data-entity="' + prev + '"]');
      if (node) { try { node.focus(); } catch (e) {} }
    }
  }

  function openBlock(id, el) {
    var ent = ENTITIES[id];
    if (!ent) return;
    if (el) lastFocused = el;
    renderPopover(ent);
    logLine('[DRILL] Inspected block: ' + ent.name + ' · ' + ent.metric);
  }

  function highlightTopology(id) {
    var ent = ENTITIES[id];
    if (!ent) return;
    ent.neighbors.forEach(function (nid) {
      var k = [ent.id, nid].sort().join('-');
      var p = document.getElementById('path-' + k);
      var pl = document.getElementById('path-' + k + '-pulse');
      if (p) p.classList.add('is-highlighted');
      if (pl) pl.classList.add('is-highlighted');
      var nn = document.querySelector('.rig-node[data-entity="' + nid + '"]');
      if (nn) nn.classList.add('is-neighbor-highlight');
    });
  }

  function clearTopology() {
    document.querySelectorAll('.rig-path-track, .rig-pulse-line').forEach(function (el) {
      el.classList.remove('is-highlighted');
    });
    document.querySelectorAll('.rig-node').forEach(function (el) {
      el.classList.remove('is-neighbor-highlight');
    });
  }

  function logLine(text, isErr) {
    var area = document.getElementById('rig-log-area');
    if (!area) return;
    var d = document.createElement('div');
    d.className = 'rig-log-line' + (isErr ? ' text-error' : '');
    d.textContent = text;
    area.appendChild(d);
    while (area.childNodes.length > 50) area.removeChild(area.firstChild);
    area.scrollTop = area.scrollHeight;
  }

  function printMap() {
    logLine('$ /drill map');
    logLine('----------------------------------------------------------------------');
    logLine('ENTITY    | F-CODE  | STATUS     | FEATURE NAME');
    logLine('----------------------------------------------------------------------');
    Object.keys(ENTITIES).forEach(function (k) {
      var ent = ENTITIES[k];
      ent.fCodes.forEach(function (fc) {
        var inf = fc.inf ? ' (mapping: inferred)' : '';
        logLine(ent.shortName.padEnd(9) + ' | ' + fc.c.padEnd(7) + ' | SSoT bridge | ' + (F_SPECS[fc.c] || fc.c) + inf);
      });
    });
    logLine('----------------------------------------------------------------------');
    logLine('5 deployment entities mapped to manifest.json feature specifications.');
  }

  function printHelp() {
    logLine('$ /drill help');
    logLine('AVAILABLE COMMANDS (SSoT LOCAL DETERMINISTIC):');
    logLine('  /drill edge     - Cloudflare WAF & TLS termination details');
    logLine('  /drill ingress  - Traefik v3 reverse proxy & 3 vhosts');
    logLine('  /drill fleet    - Proxmox LXC & rootless podman distroless');
    logLine('  /drill engine   - Static Go binary (864 KB RSS prod)');
    logLine('  /drill harness  - g8s controlplane & Aegis security gates');
    logLine('  /drill map      - Print full entity → feature map table');
    logLine('  /drill help     - Display this command reference');
  }

  function executeCmd(raw) {
    if (!raw) return;
    var t = raw.trim();
    if (!t) return;
    var cmd = t.toLowerCase();
    var arg = cmd.indexOf('/drill') === 0 ? cmd.substring(6).trim() : cmd;

    if (!arg || arg === 'help') { printHelp(); return; }
    if (arg === 'map') { printMap(); return; }

    if (ENTITIES[arg]) {
      var ent = ENTITIES[arg];
      logLine('$ /drill ' + arg);
      logLine('>> [ENTITY] ' + ent.name);
      logLine('>> [WHAT]   ' + ent.what);
      logLine('>> [METRIC] ' + ent.metric + ' (src: ' + ent.source + ')');
      var codes = ent.fCodes.map(function (c) {
        return c.c + (c.inf ? ' (mapping: inferred)' : '');
      }).join(', ');
      logLine('>> [BRIDGE] ' + codes);
      openBlock(arg, null);
      return;
    }

    logLine('$ ' + t);
    logLine('unknown target — try /drill help', true);
  }

  function init() {
    document.querySelectorAll('.rig-node').forEach(function (node) {
      var id = node.getAttribute('data-entity');
      node.addEventListener('click', function () { openBlock(id, node); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBlock(id, node); }
      });
      node.addEventListener('mouseenter', function () { highlightTopology(id); });
      node.addEventListener('mouseleave', clearTopology);
      node.addEventListener('focus', function () { highlightTopology(id); });
      node.addEventListener('blur', clearTopology);
    });

    var closeBtn = document.getElementById('rig-popover-close');
    if (closeBtn) closeBtn.addEventListener('click', closePopover);

    var wrap = document.getElementById('rig-canvas-wrap');
    if (wrap) {
      wrap.addEventListener('click', function (e) {
        if (activeId && !e.target.closest('#rig-popover') && !e.target.closest('.rig-node')) {
          closePopover();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activeId) closePopover();
    });

    var form = document.getElementById('rig-cli-form');
    var input = document.getElementById('rig-cli-input');
    if (form && input) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = input.value;
        input.value = '';
        executeCmd(val);
      });
    }

    document.querySelectorAll('[data-drill]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-drill');
        executeCmd('/drill ' + target);
        var rc = document.getElementById('constellation-rig');
        if (rc && !rc.contains(btn)) {
          rc.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'center' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
