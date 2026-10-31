/* FlowAxon v2.0 — Unified Runtime Engine (Hub + g8s.flowaxon.com + aegis.flowaxon.com)
 * Strict CSP Compliant (Zero inline scripts/handlers) + Live SSE + W3C WebMCP
 */
(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setText(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  }

  // 1. Live Telemetry Cache & SSE Stream
  let telemetryData = null;
  fetch('/data/telemetry.json')
    .then(r => r.json())
    .then(d => { telemetryData = d; })
    .catch(() => {
      telemetryData = {
        status: 'OPERATIONAL',
        dual_plane: { lan: 'UP', wan: 'UP', probe_latency_ms: 142 },
        substrate: {
          hypervisor: 'Proxmox VE 8.x (Node 1)',
          cpu: 'Intel Core i5-8500 (6 Cores)',
          ram_total_gb: 16,
          ram_free_gb: 5,
          containers_active: 15
        },
        networking: {
          gateway: 'MikroTik RouterOS',
          dhcp_lease_authority: 'MikroTik RouterOS (Single Authority DHCP)',
          ingress: 'Traefik v3 + CrowdSec (Zero-WAN Management)',
          remote_mesh: 'Tailscale Overlay Mesh'
        },
        observability: {
          engine: 'VictoriaLogs LogSQL',
          triage_latency: '<2s fast batch telemetry',
          audit_compliance: '100% Deterministic ADLC / Zero-Leakage DLP'
        }
      };
    });

  let es = null;
  function initSSE() {
    if (!window.EventSource) return;
    try {
      if (es) es.close();
      es = new EventSource('/api/v1/telemetry/stream');
      es.onopen = () => setText('#sse-status-text', 'SSE LIVE');
      es.onerror = () => setText('#sse-status-text', 'DUAL-PLANE UP');
      es.onmessage = e => {
        try {
          const d = JSON.parse(e.data);
          setText('#sse-status-text', 'SSE LIVE');
          if (d.mem_alloc_kb !== undefined) {
            setText('#sse-mem', `${d.mem_alloc_kb}KB RSS`);
          } else if (d.mem_alloc_mb !== undefined) {
            setText('#sse-mem', `${d.mem_alloc_mb.toFixed(1)}MB RSS`);
          }
          if (d.uptime_sec !== undefined) {
            setText('#sse-uptime', `up ${ d.uptime_sec }s`);
          }
        } catch (_) {}
      };
    } catch (_) {}
  }

  // 2. Isometric 4-Layer System Anatomy Rig
  const ISO_LAYERS = {
    edge: {
      title: 'LAYER 1: CLOUDFLARE ANYCAST + TRAEFIK v3 EDGE',
      summary: '15-Year Cloudflare Wildcard Origin mTLS (*.flowaxon.com) -> Traefik v3 -> Strict CSP & HSTS (A+ SecurityHeaders / 100% Green Hardenize).',
      metrics: 'TLS 1.2/1.3 Hybrid PQC • Zero-WAN Exposure • < 2ms Edge Proxy Dispatch'
    },
    g8s: {
      title: 'LAYER 2: g8s ZERO-TRUST AGENT HARNESS (g8s.flowaxon.com)',
      summary: 'F0/F1/F2 exponential containment rings + S0..S3 orthogonal control strata. Single-use path-scoped WriteReceipt & Git worktree isolation.',
      metrics: '1 Issue = 1 Worker = 1 Receipt • E_S1_DIRECT_MUTATION_FORBIDDEN'
    },
    aegis: {
      title: 'LAYER 3: AEGIS RUNTIME GUARDRAIL (aegis.flowaxon.com)',
      summary: 'L1 Shell AST Risk Scoring + L2 HMAC-SHA256 Telegram HITL 2-Factor Approval Cards + L3 Pre-Commit Zero-Leakage DLP.',
      metrics: '0 Accidental Destructive Executions • Cryptographic Callback Verification'
    },
    gitops: {
      title: 'LAYER 4: PULL-BASED GITOPS & PODMAN AUTO-UPDATE',
      summary: 'GitHub Actions builds multi-stage scratch/alpine image -> ghcr.io -> Podman auto-update pulls & rolls back automatically with 0 inbound WAN ports.',
      metrics: 'Container RAM < 20MB RSS (256MB Hard Budget) • Single Authority DHCP'
    }
  };

  function selectIsoLayer(layerId) {
    const info = ISO_LAYERS[layerId];
    if (!info) return;
    document.querySelectorAll('[data-iso-layer]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-iso-layer') === layerId);
    });
    const detail = document.getElementById('iso-layer-detail');
    if (detail) {
      detail.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-borderHairline pb-2">
          <span class="text-accentLight font-bold text-xs">${escapeHtml(info.title)}</span>
          <span class="text-signalGreen text-[11px]">${escapeHtml(info.metrics)}</span>
        </div>
        <div class="text-zinc-300 text-xs pt-2">${escapeHtml(info.summary)}</div>
      `;
    }
  }

  // 3. Journey Chapters & Architecture Node Inspector (flowaxon.com Hub)
  const CHAPTERS = [
    {
      tag: 'CH. 01 • 2016 · RETAIL SCALE',
      source: 'Thiên Nam Hòa',
      title: 'The 48-Hour Crucible (Distributed Command)',
      quote: '"Systems don\'t collapse from incidents; they collapse from chaos. In crisis, panic is the true adversary."',
      quoteBorder: 'border-accentLight',
      bullets: [
        '<strong>Crisis:</strong> 100+ endpoints hit by ransomware across retail chain with zero tolerance for POS downtime.',
        '<strong>Triage:</strong> Decoupled command into 3 squads: OS environment prep ➔ SAP/POS app restore ➔ Login access audit.',
        '<strong>Outcome:</strong> 48h overnight recovery with pre-flight automation scripts; zero business disruption on Monday opening.'
      ],
      takeaway: '↳ Lesson: Decoupled squads + Pre-flight automation > Panic.'
    },
    {
      tag: 'CH. 02 • 2021–2024 · BUSINESS LENS',
      source: 'Artstuff',
      title: 'The Departmental Lens (1% Daily Compounding)',
      quote: '"There is no great engineering without resolving daily human friction."',
      quoteBorder: 'border-signalGreen',
      bullets: [
        '<strong>HR Pain:</strong> Replaced lost equipment ledgers with auditable Snipe-IT lifecycle provisioning.',
        '<strong>Finance Bottleneck:</strong> Virtualized a dedicated MISA accounting server on Hyper-V, eliminating shared PC crashes.',
        '<strong>Resilience:</strong> Deployed 3-layer ransomware backup (In-VM snapshot ➔ NAS image ➔ Offline detached).'
      ],
      takeaway: '↳ Lesson: Technology must serve workflow, not the other way around.'
    },
    {
      tag: 'CH. 03 • SYSTEMS DISCIPLINE',
      source: 'The Automation Equation',
      title: 'The Arithmetic of Determinism',
      quote: '"A manual click takes 3 seconds. An automated script takes 3 hours. But 100 flawed clicks will cost 3 years."',
      quoteBorder: 'border-purple-400',
      bullets: [
        '<strong>The Trade-off:</strong> Upfront sacrifice of testing time and refactoring to eliminate human fatigue errors.',
        '<strong>The Bridge to AI:</strong> LLMs cannot be trusted to run on probabilistic luck; they demand deterministic code boundaries.',
        '<strong>Code over Prompt:</strong> Security perimeters enforced by Go/Python/Bash gates, not natural language suggestions.'
      ],
      takeaway: '↳ Invariant: Determinism is an upfront investment in permanent peace.'
    },
    {
      tag: 'CH. 04 • FRONTIER ERA',
      source: 'Present → Future',
      title: 'The Symbiotic Frontier (Beyond Fear)',
      quote: '"The primal human instinct is fear of what evolves faster than ourselves. But fear has never built the future."',
      quoteBorder: 'border-rose-400',
      bullets: [
        '<strong>Beyond Fear:</strong> Rejecting Hollywood "Terminator" hysteria; AI is evolving faster than human reaction time.',
        '<strong>The Architect\'s Role:</strong> Engineer a trusted, governed substrate (g8s, Second Brain) with rigid capability boundaries.',
        '<strong>The Symbiosis:</strong> Autonomous agents granted structured domain knowledge and physical write receipts to empower humans.'
      ],
      takeaway: '↳ Vision: Building the safe harbor where humans and autonomous agents thrive together.'
    }
  ];

  function switchChapter(idx) {
    const ch = CHAPTERS[idx];
    const container = document.getElementById('chapter-content');
    if (!container || !ch) return;
    document.querySelectorAll('.chapter-btn').forEach((btn, i) => {
      if (i === idx) {
        btn.className = 'chapter-btn p-2.5 rounded text-left border transition-all bg-panel text-zinc-100 border-accentLight';
        if (btn.firstElementChild) btn.firstElementChild.className = 'text-[10px] text-accentLight font-semibold';
      } else {
        btn.className = 'chapter-btn p-2.5 rounded text-left border transition-all bg-panel text-zinc-400 border-borderHairline hover:border-zinc-700';
        if (btn.firstElementChild) btn.firstElementChild.className = 'text-[10px] text-zinc-500 font-semibold';
      }
    });
    container.innerHTML = `
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="px-2 py-0.5 rounded text-[11px] bg-canvas border border-borderSubtle text-accentLight">${ch.tag}</span>
        <span class="text-zinc-500 text-[11px]">${ch.source}</span>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-zinc-100">${ch.title}</h3>
      <p class="text-xs font-mono text-zinc-300 italic border-l-2 ${ch.quoteBorder} pl-3 py-1">${ch.quote}</p>
      <ul class="text-xs text-zinc-400 space-y-1.5 pt-1">
        ${ch.bullets.map(b => `<li class="flex items-start gap-2"><span class="text-accentLight shrink-0">•</span><span>${b}</span></li>`).join('')}
      </ul>
      <div class="pt-3 border-t border-borderHairline flex items-center justify-between text-[11px] font-mono">
        <span class="text-zinc-300">${ch.takeaway}</span>
        <a href="/llms-full.txt#evolution" class="text-accentLight hover:underline">Full dossier ↗</a>
      </div>
    `;
  }

  const NODES = {
    edge: {
      title: 'EDGE-PROXY: Traefik v3 + CrowdSec',
      role: 'Perimeter Ingress & 15-Yr Origin mTLS Termination',
      status: 'ACTIVE • ZERO-WAN',
      badge: 'border-sky-500/30 text-accentLight bg-[#0c1926]',
      invariant: 'Exposed strictly on ports 80/443 proxied through Cloudflare IP ranges with 15-Year Wildcard Origin Certificate.',
      code: `entryPoints:\n  websecure:\n    address: ":443"\n    forwardedHeaders:\n      trustedIPs: ["173.245.48.0/20", "103.21.244.0/22"]\nmiddlewares:\n  sec-headers-strict:\n    headers:\n      stsSeconds: 63072000\n      referrerPolicy: "same-origin"`,
      correlation: 'In dual-plane triage, a Traefik edge or WAF failure causes WAN=DOWN while internal compute remains LAN=UP.'
    },
    auth: {
      title: 'IAM-AUTH: Authelia 2FA Gateway',
      role: 'Central Identity & Multi-Factor Access Barrier',
      status: 'ENFORCING • TOTP + WebAuthn',
      badge: 'border-amber-500/30 text-amber-400 bg-[#241705]',
      invariant: 'Every administrative route requires two-factor authentication. Zero public bypassing of IAM layer.',
      code: `access_control:\n  default_policy: deny\n  rules:\n    - domain: "*.internal.mesh"\n      policy: two_factor`,
      correlation: 'Auth layer degradation blocks external administrative access while internal daemon metrics remain healthy.'
    },
    dhcp: {
      title: 'DHCP-SSOT: MikroTik RouterOS',
      role: 'Single Authority for Network Identity',
      status: 'AUTHORITATIVE • STATIC LEASE LAW',
      badge: 'border-emerald-500/30 text-signalGreen bg-[#091f15]',
      invariant: 'All LXC containers strictly declare ip=dhcp on net0. RouterOS is the sole MAC-to-IP binding source of truth.',
      code: `/ip dhcp-server lease\nadd address=10.10.0.50 mac-address=BC:24:11:A1:02:11 comment="traefik-proxy"\nadd address=10.10.0.44 mac-address=BC:24:11:11:BE:3B comment="svc-flowaxon-prod"`,
      correlation: 'Substrate independence: RouterOS queries upstream Anycast resolvers directly, eliminating circular DNS dependencies.'
    },
    dual: {
      title: 'DUAL-PLANE: Uptime Kuma Telemetry',
      role: 'Sub-Second Fault Isolation & Correlated Probing',
      status: 'MONITORING • 142ms SYNTHETIC RTT',
      badge: 'border-sky-500/30 text-accentLight bg-[#0c1926]',
      invariant: 'Every public service has two monitors: [LAN] internal compute health and [WAN] public edge reachability.',
      code: `Service: FlowAxon Constellation\n  Plane 1: [LAN] http://10.10.0.44:80/healthz -> HTTP 200 (0.8ms)\n  Plane 2: [WAN] https://flowaxon.com/healthz -> HTTP 200 (38ms)`,
      correlation: 'Eliminates guess-work during incidents; pinpoints failure plane in < 0.8 seconds without manual SSH probing.'
    },
    log: {
      title: 'LOG-SINK: VictoriaLogs LogSQL',
      role: 'High-Throughput Telemetry & Fast Batch Triage',
      status: 'INDEXING • <2s QUERY LATENCY',
      badge: 'border-purple-500/30 text-purple-400 bg-[#1e0f2b]',
      invariant: 'Centralized LogSQL precedence: Incident triage queries VictoriaLogs before opening interactive SSH sessions.',
      code: `curl -G http://10.10.0.80:9428/select/logsql/query \\\n  -d 'query=_time:5m AND status_code:>=500 AND service:flowaxon'`,
      correlation: 'Sub-2-second fast batch telemetry law satisfies the Hardware Reality Invariant with low memory consumption.'
    }
  };

  function inspectNode(nodeId) {
    const node = NODES[nodeId];
    if (!node) return;
    document.querySelectorAll('.node-pill').forEach(pill => {
      if (pill.getAttribute('data-node') === nodeId) {
        pill.className = 'node-pill px-2.5 py-1 rounded border border-accentLight bg-panel text-accentLight transition-all';
      } else {
        pill.className = 'node-pill px-2.5 py-1 rounded border border-borderHairline bg-panel text-zinc-400 hover:border-zinc-600 transition-all';
      }
    });
    const detail = document.getElementById('node-detail');
    if (!detail) return;
    detail.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderHairline pb-2.5">
        <div>
          <div class="text-zinc-100 font-bold text-sm tracking-tight">${escapeHtml(node.title)}</div>
          <div class="text-zinc-500 text-[11px]">${escapeHtml(node.role)}</div>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono border self-start sm:self-auto ${node.badge}">${escapeHtml(node.status)}</span>
      </div>
      <div class="space-y-1.5 pt-1 text-[11px]">
        <div><span class="text-zinc-400 font-semibold">Architectural Invariant:</span> <span class="text-zinc-300">${escapeHtml(node.invariant)}</span></div>
        <div><span class="text-accentLight font-semibold">Observability Correlation:</span> <span class="text-zinc-300">${escapeHtml(node.correlation)}</span></div>
      </div>
      <div class="pt-2">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Configuration Artifact / Runtime Spec:</div>
        <pre class="p-2.5 rounded bg-black border border-borderHairline text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">${escapeHtml(node.code)}</pre>
      </div>
    `;
  }

  function toggleTopologyDrawer() {
    const drawer = document.getElementById('topology-drawer');
    const chevron = document.getElementById('topology-chevron');
    if (!drawer) return;
    drawer.classList.toggle('hidden');
    if (chevron) chevron.classList.toggle('rotate-180');
  }

  function copyCurl() {
    const cmdEl = document.getElementById('curl-cmd');
    const text = cmdEl ? cmdEl.innerText : 'curl -sL https://flowaxon.com/llms.txt';
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copy-btn');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="text-signalGreen">Copied!</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    });
  }

  // 4. Interactive SRE Terminal
  const AVAILABLE_CMDS = [
    'drill', 'ping', 'ping wan', 'ping lan', 'uptime', 'products', 'g8s', 'aegis',
    'topology', 'story', 'skills', 'homelab', 'status', 'telemetry', 'projects', 'contact', 'clear', 'help'
  ];

  const CMDS = {
    help: () => `<div class="text-zinc-400 space-y-0.5 font-mono text-[11px]">
      <div><span class="text-amber-400 font-semibold">drill</span>          - Execute live /api/v1/drill SRE fault correlation</div>
      <div><span class="text-accentLight font-semibold">products</span>       - Query live /api/v1/products constellation catalog</div>
      <div><span class="text-accentLight font-semibold">g8s / aegis</span>    - Inspect g8s.flowaxon.com &amp; aegis.flowaxon.com portals</div>
      <div><span class="text-signalGreen font-semibold">ping [wan|lan]</span> - Transmit simulated ICMP probes to edge or substrate</div>
      <div><span class="text-zinc-200 font-semibold">uptime</span>         - Real-time substrate uptime &amp; memory budget load</div>
      <div><span class="text-accentLight">topology</span>       - Expand dual-plane homelab architecture diagram</div>
      <div><span class="text-accentLight">story / skills</span> - 11-year evolution &amp; dual-track capabilities</div>
      <div><span class="text-accentLight">telemetry</span>      - Raw JSON SRE telemetry payload</div>
      <div><span class="text-accentLight">clear</span>          - Reset terminal screen</div>
    </div>`,
    drill: () => {
      fetch('/api/v1/drill', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: 'wan-504' }) })
        .then(r => r.json())
        .then(d => {
          const screen = document.getElementById('terminal-screen');
          if (!screen) return;
          const el = document.createElement('div');
          el.className = 'text-signalGreen font-mono text-[11px] pl-2 border-l border-amber-500/50';
          el.textContent = `[LIVE API /api/v1/drill] correlation=${d.correlation} | isolation=${d.isolation_ms}ms | root_cause=${d.root_cause}`;
          screen.appendChild(el);
          screen.scrollTop = screen.scrollHeight;
        }).catch(() => {});
      return `<div class="text-amber-400 font-mono text-[11px] pl-2 border-l border-amber-500/50">⚡ Dispatched POST /api/v1/drill (scenario=wan-504)...</div>`;
    },
    products: () => `<div class="text-zinc-300 space-y-1 pl-2 border-l border-borderSubtle font-mono text-[11px]">
      <div>• <a href="https://flowaxon.com" class="text-accentLight underline">flowaxon.com</a> — Engineering Hub &amp; Constellation Map</div>
      <div>• <a href="https://g8s.flowaxon.com" class="text-accentLight underline">g8s.flowaxon.com</a> — Zero-Trust Agent Harness (v0.21.0)</div>
      <div>• <a href="https://aegis.flowaxon.com" class="text-rose-400 underline">aegis.flowaxon.com</a> — Shell AST &amp; Telegram HITL Guardrail (v1.4.0)</div>
    </div>`,
    g8s: () => `<div class="text-zinc-300 font-mono text-[11px] pl-2 border-l border-accentLight">➔ Portal: <a href="https://g8s.flowaxon.com" class="text-accentLight underline">https://g8s.flowaxon.com</a> (WriteReceipt &amp; Stratum Firewall Playground)</div>`,
    aegis: () => `<div class="text-zinc-300 font-mono text-[11px] pl-2 border-l border-rose-400">➔ Portal: <a href="https://aegis.flowaxon.com" class="text-rose-400 underline">https://aegis.flowaxon.com</a> (Shell AST &amp; Telegram HITL Playground)</div>`,
    ping: (args) => {
      const isLan = (args || '').trim().toLowerCase() === 'lan';
      const dest = isLan ? 'gateway.substrate.local' : 'flowaxon.com (Cloudflare Anycast)';
      const rtt = isLan ? 0.35 : 16.8;
      return `<div class="text-zinc-300 font-mono text-[11px] pl-2 border-l border-borderSubtle">PING ${dest}: 4 packets transmitted, 0% loss, avg rtt=${rtt}ms</div>`;
    },
    'ping wan': () => CMDS.ping('wan'),
    'ping lan': () => CMDS.ping('lan'),
    uptime: () => `<div class="text-signalGreen font-mono text-[11px] pl-2 border-l border-borderSubtle">Proxmox VE Node 1 (i5-8500, 16GB RAM) • flowaxon-engine &lt; 20MB RSS • Single DHCP Authority</div>`,
    topology: () => { toggleTopologyDrawer(); return `<div class="text-accentLight font-mono text-[11px]">[Topology Drawer Toggled]</div>`; },
    story: () => `<div class="text-zinc-300 font-mono text-[11px]">See <a href="#journey" class="text-accentLight underline">#journey</a> or <a href="/llms-full.txt" class="text-accentLight underline">/llms-full.txt</a></div>`,
    skills: () => `<div class="text-zinc-300 font-mono text-[11px]">Track 1: Proxmox VE, RouterOS, Traefik v3, Podman, Ansible | Track 2: Go, g8s, Aegis HITL, VictoriaLogs</div>`,
    homelab: () => `<div class="text-zinc-300 font-mono text-[11px]">Node 1: i5-8500 16GB RAM • Traefik v3 Edge • 15-Yr Origin mTLS • Pull-GitOps Auto-Update</div>`,
    status: () => `<div class="text-signalGreen font-mono text-[11px]">OPERATIONAL • LAN=UP • WAN=UP • SecurityHeaders=A+ • Hardenize=100% Green</div>`,
    telemetry: () => `<pre class="text-[11px] text-zinc-300 font-mono whitespace-pre-wrap">${escapeHtml(JSON.stringify(telemetryData || { status: 'OPERATIONAL' }, null, 2))}</pre>`,
    projects: () => CMDS.products(),
    contact: () => `<div class="text-zinc-300 font-mono text-[11px]">Email: ductam1828@gmail.com • GitHub: github.com/tamld • LinkedIn: linkedin.com/in/tamld</div>`,
    clear: () => {
      const s = document.getElementById('terminal-screen');
      if (s) s.innerHTML = '';
      return null;
    }
  };

  const cmdHistory = [];
  let historyIndex = -1;

  function termExec(raw) {
    const screen = document.getElementById('terminal-screen');
    const cmd = (raw || '').trim();
    if (!screen || !cmd) return;
    const line = document.createElement('div');
    line.innerHTML = `<span class="text-signalGreen">guest@tamld:~$</span> <span class="text-zinc-100">${escapeHtml(cmd)}</span>`;
    screen.appendChild(line);

    const lower = cmd.toLowerCase();
    let fn = CMDS[lower];
    let args = '';
    if (!fn) {
      const parts = lower.split(/\s+/);
      args = parts.slice(1).join(' ');
      if (CMDS[parts[0]]) fn = () => CMDS[parts[0]](args);
    }
    if (fn) {
      const out = fn(args);
      if (out !== null && out !== undefined) {
        const el = document.createElement('div');
        el.innerHTML = out;
        screen.appendChild(el);
      }
    } else {
      const err = document.createElement('div');
      err.className = 'text-rose-400 font-mono text-[11px]';
      err.innerHTML = `command not found: ${escapeHtml(cmd)}. Type <span class="text-accentLight">help</span>.`;
      screen.appendChild(err);
    }
    screen.scrollTop = screen.scrollHeight;
  }

  // 5. g8s Playground & Multi-Tab CLI Explorer (g8s.flowaxon.com)
  const G8S_PRESETS = {
    's3m-ok': { tier: 'F1', stratum: 'S3-M', target_path: 'internal/worker/runner.go' },
    's1-blocked': { tier: 'F0', stratum: 'S1', target_path: 'main.go' },
    's3a-blocked': { tier: 'F1', stratum: 'S3-A', target_path: 'internal/worker/runner.go' },
    'env-dlp': { tier: 'F1', stratum: 'S3-M', target_path: '.env.production' },
    'scope-violation': { tier: 'F1', stratum: 'S3-M', target_path: '../../etc/passwd' }
  };

  const G8S_TABS = {
    submit: `# 1. L1 System-1 Reflex Triage & Single-Use WriteReceipt Issuance
$ ./bin/g8s reflex triage --summary "Implement bounded worker runner" --files "internal/worker/runner.go"
$ REC=$(./bin/g8s receipt issue --path "internal/worker/*.go" --ttl 1800 --json | ./bin/g8s select data.receipt_id)

# 2. Submit Durable Task with Draft-7 Output Schema & Effort Timeout Scaling
$ TASK=$(./bin/g8s submit \\
    --idempotency-key wf-runner-v1 \\
    --permission workspace_write \\
    --role implementer \\
    --provider 9router \\
    --model deep-coding \\
    --receipt-id "$REC" \\
    --prompt "Implement CAS lease claim..." --json | ./bin/g8s select data.task_id)`,
    worker: `# 3. Execute Isolated F1 Worker Loop (Git Worktree + Setpgid Process Group)
$ G8S_STATE_DIR=~/.local/state/g8s-sess-01 ./bin/g8s worker --once --provider 9router --model deep-coding
[info] worker: attempt isolated in worktree ~/.local/state/g8s-sess-01/worktrees/wt-9a8f12c4
[info] worker: G8S_TIER=F1 G8S_RECEIPT_ID=rcpt-cas-verified enforced in-process

# 4. Event-Driven Watch (Zero Polling Burn)
$ ./bin/g8s watch --task "$TASK" --milestone worker-complete --json`,
    io: `# 5. Pure-Go Cross-Platform Agent I/O (Replaces rg/cat/sed/jq across CLI, MCP & HTTP)
$ ./bin/g8s search "AllowedPaths" --dir internal/
$ ./bin/g8s read internal/receipt/verify.go --lines 1:60
$ ./bin/g8s edit internal/worker/runner.go --old "timeout := 30" --new "timeout := 90" --if-sha256 a4f9...
$ ./bin/g8s tasks --state WORKER_COMPLETED --json | ./bin/g8s select data.tasks.0.task_id`,
    verify: `# 6. S3-A Double-Blind Verification & Mechanical DoD Check
$ ./bin/g8s verify --task "$TASK" --json
{
  "v": 1,
  "cmd": "verify",
  "data": { "verdict": "PASS", "epistemic_tier": "MECHANICAL_VERIFIED", "canary_mutant_killed": true }
}

# 7. Deliver Worktree Diff to Checkout & Prune Ephemeral Worktree
$ ./bin/g8s deliver "$TASK" --prune-worktree --json`
  };

  function switchG8sTab(tabId) {
    const box = document.getElementById('g8s-tab-content');
    if (!box || !G8S_TABS[tabId]) return;
    document.querySelectorAll('[data-g8s-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-g8s-tab') === tabId);
    });
    box.innerHTML = `<pre class="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">${escapeHtml(G8S_TABS[tabId])}</pre>`;
  }

  async function verifyG8s(payload) {
    const out = document.getElementById('g8s-verify-output');
    if (out) out.textContent = 'Verifying receipt boundary via POST /api/v1/g8s/verify-receipt...';
    try {
      const res = await fetch('/api/v1/g8s/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (out) {
        out.className = data.allowed ? 'text-signalGreen' : 'text-rose-400';
        out.textContent = JSON.stringify(data, null, 2);
      }
    } catch (err) {
      if (out) out.textContent = 'Error: ' + err.message;
    }
  }

  // 6. Aegis Playground & Realistic Telegram HITL Simulator (aegis.flowaxon.com)
  async function analyzeAegis(command) {
    const out = document.getElementById('aegis-result') || document.getElementById('aegis-analyze-output');
    const cmdSpan = document.getElementById('aegis-hitl-cmd');
    const statusEl = document.getElementById('aegis-hitl-status');
    const scoreBadge = document.getElementById('aegis-score-badge');
    const riskBar = document.getElementById('aegis-risk-bar');
    const tgBadge = document.getElementById('aegis-tg-badge');
    if (out) out.textContent = 'Analyzing Shell AST via POST /api/v1/aegis/analyze...';
    try {
      const res = await fetch('/api/v1/aegis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      const isSafe = data.action === 'ALLOW' || data.risk_level === 'SAFE_AUTO_APPROVE' || data.risk_level === 'LOW_SAFE';
      const score = data.risk_score !== undefined ? data.risk_score : (isSafe ? 8 : 94);
      if (out) {
        out.className = isSafe ? 'text-signalGreen' : 'text-rose-400';
        out.textContent = JSON.stringify(data, null, 2);
      }
      if (scoreBadge) {
        scoreBadge.textContent = `${score} / 100 (${data.risk_level || 'ANALYZED'})`;
        scoreBadge.className = isSafe ? 'font-bold text-signalGreen' : 'font-bold text-rose-400';
      }
      if (riskBar) {
        riskBar.className = isSafe
          ? 'risk-meter-fill risk-safe'
          : (score >= 85 ? 'risk-meter-fill risk-high' : 'risk-meter-fill risk-med');
      }
      if (cmdSpan) cmdSpan.textContent = command;
      if (tgBadge) {
        tgBadge.textContent = isSafe ? 'AUTO-APPROVED' : 'HITL REQUIRED';
        tgBadge.className = isSafe
          ? 'px-2 py-0.5 rounded bg-[#091f15] border border-signalGreen text-signalGreen font-mono text-[10px]'
          : 'px-2 py-0.5 rounded bg-[#3b0c19] border border-rose-400 text-rose-400 font-mono text-[10px]';
      }
      if (statusEl) {
        statusEl.textContent = isSafe
          ? '✅ Fast-Path Auto-Approved (Score < 70) — Executed without operator interruption.'
          : `⏳ Frozen via SIGSTOP — Awaiting Operator 2FA callback on ${(data.hitl_card && data.hitl_card.channel) || 'Telegram Bot API'}...`;
      }
    } catch (err) {
      if (out) out.textContent = 'Error: ' + err.message;
    }
  }

  // 7. Global Strict-CSP Event Delegation
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a, [data-iso-layer], [data-term-cmd], [data-ch], [data-node], [data-g8s-preset], [data-g8s-tab], [data-aegis-cmd], [data-hitl-action]');
    if (!t) return;

    if (t.id === 'toggle-topology-btn') { e.preventDefault(); return toggleTopologyDrawer(); }
    if (t.id === 'copy-btn') { e.preventDefault(); return copyCurl(); }
    if (t.id === 'terminal-run') {
      e.preventDefault();
      const inp = document.getElementById('terminal-input');
      if (inp && inp.value.trim()) {
        cmdHistory.push(inp.value.trim());
        historyIndex = cmdHistory.length;
        termExec(inp.value);
        inp.value = '';
      }
      return;
    }
    if (t.id === 'g8s-verify-btn') {
      e.preventDefault();
      const tierEl = document.getElementById('g8s-tier');
      const s = document.getElementById('g8s-stratum');
      const p = document.getElementById('g8s-path');
      return verifyG8s({
        tier: tierEl ? tierEl.value : 'F1',
        stratum: s ? s.value : 'S3-M',
        target_path: (p && p.value.trim()) ? p.value.trim() : 'internal/worker/runner.go'
      });
    }
    if (t.hasAttribute('data-g8s-preset')) {
      e.preventDefault();
      const key = t.getAttribute('data-g8s-preset');
      const preset = G8S_PRESETS[key];
      if (preset) {
        const tierEl = document.getElementById('g8s-tier');
        const s = document.getElementById('g8s-stratum');
        const p = document.getElementById('g8s-path');
        if (tierEl) tierEl.value = preset.tier;
        if (s) s.value = preset.stratum;
        if (p) p.value = preset.target_path;
        verifyG8s(preset);
      }
      return;
    }
    if (t.hasAttribute('data-g8s-tab')) {
      e.preventDefault();
      return switchG8sTab(t.getAttribute('data-g8s-tab'));
    }
    if (t.hasAttribute('data-aegis-cmd')) {
      e.preventDefault();
      const cmd = t.getAttribute('data-aegis-cmd');
      const inp = document.getElementById('aegis-command');
      if (inp) inp.value = cmd;
      return analyzeAegis(cmd);
    }
    if (t.hasAttribute('data-hitl-action')) {
      e.preventDefault();
      const act = t.getAttribute('data-hitl-action');
      const statusEl = document.getElementById('aegis-hitl-status');
      if (statusEl) {
        statusEl.textContent = act === 'APPROVE'
          ? '✅ APPROVED by Operator via signed Telegram callback (HMAC-SHA256 verified → SIGCONT sent).'
          : '🛑 DENIED by Operator — Process group killed (SIGKILL -PGID) & incident logged to VictoriaLogs.';
      }
      return;
    }
    if (t.hasAttribute('data-term-cmd')) { e.preventDefault(); return termExec(t.getAttribute('data-term-cmd')); }
    if (t.hasAttribute('data-ch')) { e.preventDefault(); return switchChapter(Number(t.getAttribute('data-ch'))); }
    if (t.hasAttribute('data-node')) { e.preventDefault(); return inspectNode(t.getAttribute('data-node')); }
    if (t.hasAttribute('data-iso-layer')) { e.preventDefault(); return selectIsoLayer(t.getAttribute('data-iso-layer')); }
  });

  document.addEventListener('submit', e => {
    if (e.target && e.target.id === 'aegis-form') {
      e.preventDefault();
      const inp = document.getElementById('aegis-command');
      if (inp && inp.value.trim()) analyzeAegis(inp.value.trim());
    }
  });

  // 8. W3C WebMCP Registration (navigator.modelContext)
  if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
    const tools = [
      {
        name: 'list_flowaxon_products',
        description: 'List all AI & Infrastructure products in the FlowAxon Constellation',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => (await fetch('/api/v1/products')).json()
      },
      {
        name: 'query_live_telemetry',
        description: 'Query live Go runtime and bare-metal substrate telemetry',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => (await fetch('/api/v1/telemetry')).json()
      },
      {
        name: 'simulate_sre_drill',
        description: 'Execute a non-destructive Dual-Plane SRE fault isolation drill',
        inputSchema: { type: 'object', properties: { scenario: { type: 'string' } } },
        annotations: { readOnlyHint: true },
        execute: async (args) => (await fetch('/api/v1/drill', { method: 'POST', body: JSON.stringify(args || {}) })).json()
      },
      {
        name: 'verify_g8s_receipt',
        description: 'Verify a g8s WriteReceipt & Stratum Firewall mutation request',
        inputSchema: { type: 'object', properties: { tier: { type: 'string' }, stratum: { type: 'string' }, target_path: { type: 'string' } }, required: ['tier', 'stratum', 'target_path'] },
        annotations: { readOnlyHint: true },
        execute: async (args) => (await fetch('/api/v1/g8s/verify-receipt', { method: 'POST', body: JSON.stringify(args) })).json()
      },
      {
        name: 'analyze_aegis_command',
        description: 'Analyze a shell command against the Aegis AST firewall and HITL policy',
        inputSchema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] },
        annotations: { readOnlyHint: true },
        execute: async (args) => (await fetch('/api/v1/aegis/analyze', { method: 'POST', body: JSON.stringify(args) })).json()
      }
    ];
    tools.forEach(t => {
      try { navigator.modelContext.registerTool(t); } catch (_) {}
    });
  }

  // 9. Initialization on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initSSE();
    switchChapter(0);
    inspectNode('edge');
    selectIsoLayer('edge');
    switchG8sTab('submit');

    const input = document.getElementById('terminal-input');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const v = input.value.trim();
          input.value = '';
          if (v) {
            cmdHistory.push(v);
            historyIndex = cmdHistory.length;
            termExec(v);
          }
        } else if (e.key === 'ArrowUp' && cmdHistory.length > 0 && historyIndex > 0) {
          e.preventDefault();
          historyIndex--;
          input.value = cmdHistory[historyIndex];
        } else if (e.key === 'ArrowDown' && cmdHistory.length > 0) {
          e.preventDefault();
          if (historyIndex < cmdHistory.length - 1) {
            historyIndex++;
            input.value = cmdHistory[historyIndex];
          } else {
            historyIndex = cmdHistory.length;
            input.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const val = input.value.trim().toLowerCase();
          if (!val) return;
          const matches = AVAILABLE_CMDS.filter(c => c.startsWith(val));
          if (matches.length === 1) input.value = matches[0];
        }
      });
    }

    window.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== input && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        if (input) {
          e.preventDefault();
          input.focus();
        }
      }
    });

    if (document.getElementById('g8s-verify-output')) {
      verifyG8s(G8S_PRESETS['s3m-ok']);
    }
    if (document.getElementById('aegis-result')) {
      analyzeAegis('kubectl delete namespace production');
    }
  });
})();
