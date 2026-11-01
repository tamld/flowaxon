/* FlowAxon v5 interactions — CSP-clean (no eval, no inline handlers).
   Data law: every number on the page links a real artifact. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  /* ── theme ── */
  var tgl = $('#tgl'), lbl = $('#tglLbl');
  function setTheme(dark) {
    document.documentElement.toggleAttribute('data-theme', !!dark);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    lbl.textContent = dark ? 'Blueprint' : 'Paper';
    try { localStorage.setItem('fx-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  var stored = null;
  try { stored = localStorage.getItem('fx-theme'); } catch (e) {}
  setTheme(stored === 'dark');
  if (tgl) tgl.addEventListener('click', function () {
    setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  });

  /* ── reveal cascade ── */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ── stats: tap flips source face (touch) ── */
  document.querySelectorAll('.stat').forEach(function (st) {
    st.addEventListener('click', function () { st.classList.toggle('flip'); });
  });

  /* ── ACT I: build ledger + scrub + wireframe rebuild ── */
  var ledgerEl = $('#ledger'), scrub = $('#scrub'), pos = $('#scrubPos'),
      rebuild = $('#rebuild'), play = $('#scrubPlay');
  var blocks = ['wide','sml','sml','sml','sml','mid','mid','mid','mid','sml','sml','sml','sml','wide','mid','mid','sml','sml','sml','sml'];
  if (rebuild) blocks.forEach(function (b) {
    var i = document.createElement('i'); i.className = b; rebuild.appendChild(i);
  });
  var rows = [];
  function paint(t) { // t in [0,1]
    var n = rows.length, shown = Math.round(t * n);
    rows.forEach(function (r, i) { r.el.classList.toggle('on', i < shown); });
    var ib = blocks.length;
    var bOn = Math.round(t * ib);
    rebuild.querySelectorAll('i').forEach(function (b, i) { b.classList.toggle('on', i < bOn); });
    var r0 = rows[Math.max(0, shown - 1)];
    pos.textContent = shown ? ('commit ' + shown + '/' + n + ' · ' + (r0 ? r0.date : '')) : 't=0';
  }
  fetch('/assets/v5/ledger.json').then(function (r) { return r.json(); }).then(function (d) {
    d.rows.forEach(function (row) {
      var div = document.createElement('div'); div.className = 'wave';
      var w = document.createElement('span'); w.className = 'w'; w.textContent = row.wave;
      var dd = document.createElement('span'); dd.className = 'd';
      var b = document.createElement('b'); b.textContent = row.title + ' — ';
      dd.appendChild(b);
      dd.appendChild(document.createTextNode(row.detail));
      if (row.url) {
        var a = document.createElement('a'); a.href = row.url;
        a.textContent = row.sha ? row.sha + ' · commit' : 'browse';
        a.target = '_blank'; a.rel = 'noopener';
        dd.appendChild(a);
      }
      div.appendChild(w); div.appendChild(dd);
      ledgerEl.appendChild(div);
      row.date = row.date || ''; row.el = div;
      rows.push(row);
    });
    // auto-play once when the act scrolls into view
    var once = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        once.disconnect();
        animateScrub();
      });
    }, { threshold: 0.35 });
    once.observe($('#builtby'));
  }).catch(function () {
    ledgerEl.textContent = 'ledger unavailable — see github.com/tamld/tamld.github.io/commits/main';
  });
  var raf = null;
  function animateScrub() {
    cancelAnimationFrame(raf);
    var t0 = null, dur = 9000;
    function step(ts) {
      if (!t0) t0 = ts;
      var t = Math.min(1, (ts - t0) / dur);
      scrub.value = Math.round(t * 1000);
      paint(t);
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  if (scrub) scrub.addEventListener('input', function () {
    cancelAnimationFrame(raf);
    paint(scrub.value / 1000);
  });
  if (play) play.addEventListener('click', animateScrub);

  /* ── ACT II: rig v2 — dispatch story ── */
  var rig3 = $('#rig3'), sheet = $('#rigSheet'), packet = $('#packet'),
      rigNote = $('#rigNote'), anatomy = $('#anatomy');
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // waypoints (% of sheet) — F0 top-right, F1 middle, F2 bottom-left
  var WP = { F0: [88, 22], F1: [50, 46], F2: [12, 70] };
  var ANATOMY = {
    F0: { t: 'F0 · the architect', ul: [
      'Full trust — the only tier that commits',
      'Issues charters, reads sealed receipts',
      'F0 ↔ F2 = 0 direct edges — sees evidence, not files',
      ['ADR-0032 — containment levels', 'https://github.com/tamld/g8s/blob/main/docs/decisions/0032-containment-levels.md']] },
    F1: { t: 'F1 · the executor', ul: [
      'Claims tasks with a CAS lease — single winner',
      'Writes sealed by single-use, path-scoped receipts',
      'F1 ↔ F1 = 0 — no horizontal edges, frozen briefs only',
      ['g8s harness — tamld/g8s', 'https://github.com/tamld/g8s']] },
    F2: { t: 'F2 · the subtask sandbox', ul: [
      'Isolated git worktree per task',
      'Killable OS process group (Setpgid)',
      'Receipt jail: AllowedPaths enforced in-process',
      ['cardinality law — 1 issue = 1 worker = 1 receipt', 'https://github.com/tamld/g8s']] }
  };
  var STEPS = [
    { at: 0,    wp: 'F0', on: 'F0', chip: 'c-f0',    note: '<b>F0</b> — the architect issues the brief' },
    { at: 1400, wp: 'F1', on: 'F1', chip: 'c-lease', note: '<b>F1</b> — lease claimed (CAS) · worktree isolating' },
    { at: 3200, wp: 'F2', on: 'F2', chip: 'c-work',  note: '<b>F2</b> — subtask writes inside the sandbox',
      seals: [300, 700, 1100] },
    { at: 5700, wp: 'F1', on: 'F1', chip: 'c-receipt', note: '<b>F1</b> — write receipt <b>sealed</b> · single-use, path-scoped' },
    { at: 7600, wp: 'F0', on: 'F0', chip: 'c-gate', note: '<b>F0</b> — the gate: a human confirms the merge' },
    { at: 9200, wp: 'F0', on: 'F0', chip: 'c-merge', note: 'merged ✓ — one issue = one worker = one receipt' },
    { at: 11000, clear: true, note: 'restarting the dispatch…' }
  ];
  var timers = [], frozen = false, descended = null, stepIdx = 0;

  function clearStep() {
    rig3.querySelectorAll('.chip.on').forEach(function (c) { c.classList.remove('on'); });
    rig3.querySelectorAll('.seal.on').forEach(function (s) { s.classList.remove('on'); });
    var ring = rig3.querySelector('.gate-ring'); if (ring) ring.classList.remove('on');
    rig3.querySelectorAll('.plane').forEach(function (pl) { pl.classList.remove('active'); });
  }
  function applyStep(st) {
    if (st.clear) { clearStep(); rigNote.textContent = st.note.replace(/<[^>]+>/g, ''); return; }
    clearStep();
    packet.style.left = WP[st.wp][0] + '%';
    packet.style.top = WP[st.wp][1] + '%';
    var pl = rig3.querySelector('.plane.' + (st.on === 'F0' ? 'p3' : st.on === 'F1' ? 'p2' : 'p1'));
    if (pl) pl.classList.add('active');
    var chip = rig3.querySelector('.' + st.chip);
    if (chip) chip.classList.add('on');
    if (st.chip === 'c-gate') { var ring = rig3.querySelector('.gate-ring'); if (ring) ring.classList.add('on'); }
    (st.seals || []).forEach(function (d) {
      timers.push(setTimeout(function () {
        var first = rig3.querySelector('.seal:not(.on)');
        if (first) first.classList.add('on');
      }, d));
    });
    rigNote.innerHTML = st.note;
  }
  function runLoop() {
    timers.forEach(clearTimeout); timers = [];
    stepIdx = 0;
    STEPS.forEach(function (st) {
      timers.push(setTimeout(function () {
        if (frozen || descended) return;
        applyStep(st);
        stepIdx = STEPS.indexOf(st) + 1;
      }, st.at));
    });
    timers.push(setTimeout(runLoop, 11800));
  }
  function toggleFreeze() {
    frozen = !frozen;
    packet.classList.toggle('frozen', frozen);
    if (frozen) {
      rigNote.innerHTML = 'frozen — this state is a law: <b>one issue = one worker = one receipt</b>. click the packet to resume';
    } else {
      rigNote.innerHTML = 'resumed — the packet continues its containment';
    }
  }
  function showAnatomy(layer) {
    var a = ANATOMY[layer];
    var html = '<h4>' + a.t + '</h4><ul>';
    a.ul.forEach(function (li) {
      html += '<li>' + (Array.isArray(li) ? '<a href="' + li[1] + '" target="_blank" rel="noopener">' + li[0] + '</a>' : li) + '</li>';
    });
    html += '</ul>';
    anatomy.innerHTML = html;
    anatomy.classList.add('show');
  }
  function descend(layer) {
    if (descended === layer) { // pull back
      descended = null;
      rig3.removeAttribute('data-desc');
      anatomy.classList.remove('show');
      return;
    }
    descended = layer;
    rig3.setAttribute('data-desc', layer);
    showAnatomy(layer);
  }
  if (rig3) {
    rig3.querySelectorAll('.plane').forEach(function (pl) {
      pl.addEventListener('click', function () {
        if (dragMoved) return;
        descend(pl.getAttribute('data-layer'));
      });
      pl.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); descend(pl.getAttribute('data-layer')); }
      });
    });
    packet.addEventListener('click', function () { if (!dragMoved) toggleFreeze(); });
    packet.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggleFreeze(); }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && descended) descend(descended);
    });
    // drag to rotate the drafting sheet
    var dragging = false, sx = 0, sy = 0, rz = -38, rx = 52, moved = 0;
    var dragMoved = false;
    rig3.addEventListener('pointerdown', function (ev) {
      dragging = true; dragMoved = false; sx = ev.clientX; sy = ev.clientY;
      rig3.classList.add('dragging'); rig3.setPointerCapture(ev.pointerId);
    });
    rig3.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      var dx = ev.clientX - sx, dy = ev.clientY - sy;
      moved = Math.abs(dx) + Math.abs(dy);
      if (moved > 6) dragMoved = true;
      rz = Math.max(-62, Math.min(-14, -38 + dx * 0.12));
      rx = Math.max(28, Math.min(68, 52 - dy * 0.1));
      sheet.style.setProperty('--rz', rz + 'deg');
      sheet.style.setProperty('--rx', rx + 'deg');
    });
    rig3.addEventListener('pointerup', function () {
      dragging = false; rig3.classList.remove('dragging');
      setTimeout(function () { dragMoved = false; }, 50);
    });
    rig3.addEventListener('pointercancel', function () { dragging = false; rig3.classList.remove('dragging'); });
    // boot
    var boot = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        boot.disconnect();
        if (REDUCED) { applyStep(STEPS[5]); rigNote.textContent = 'static sheet — packet motion disabled (reduced motion)'; }
        else runLoop();
      });
    }, { threshold: 0.3 });
    boot.observe(rig3);
  }

  /* ── ACT III: terminal drill — real capture, task 6a605f76 ── */
  var out = $('#termOut'), tin = $('#termIn'), pal = $('#pal');
  var SCRIPTS = {
    submit: [
      ['$ g8s submit -provider agy -model gemini-3.8-flash-low -effort low -role scout', 'lc'],
      ['  -permission read_only · prompt: "Reply with exactly: {\\"ok\\":true,\\"harness\\":\\"g8s\\"}"', 'lc'],
      ['task 6a605f76-8a88-4b7f-a457-df194c6775e6 · state QUEUED', 'la'],
      ['request_hash 2f45b299 · queue: sqlite WAL · single-winner', 'c'],
      ['worker --once → claim affinity: provider=agy', 'c'],
      ['task_claimed · lease 60s · lease_token b9f379a2…', 'lp'],
      ['task_started · worktree isolated · sandbox F1', 'c'],
      ['response: {"ok":true,"harness":"g8s"}', 'lp'],
      ['attempt_finished · result_hash 99bcdd7e… · 5.86s', 'c'],
      ['state WORKER_COMPLETED · receipt 96fd2088fe80da90 sealed', 'lp']
    ],
    watch: [
      ['$ g8s watch --milestone worker-complete', 'lc'],
      ['listening (long-poll) …', 'c'],
      ['event: attempt_finished → WORKER_COMPLETED', 'lp'],
      ['wake: supervisor notified · 0 polling wasted', 'lp']
    ],
    verify: [
      ['$ g8s verify --task 6a605f76 --json', 'lc'],
      ['RoundReceiptSchema: ok=true · duration 5.86s', 'lp'],
      ['receipt 96fd2088fe80da90 · single-use · consumed', 'lp'],
      ['verdict: real capture, zero fabrication', 'la']
    ],
    charter: [
      ['$ g8s charter — S1 FederationCoordinator', 'lc'],
      ['read-only multi-repo charter · mutation blocked', 'la'],
      ['E_S1_DIRECT_MUTATION_FORBIDDEN if crossed', 'lc'],
      ['6 Laws · cardinality 1:1:1 · F1↔F1 = 0 edges', 'c']
    ]
  };
  var CMDS = Object.keys(SCRIPTS);
  var palIdx = 0, palOpen = false;
  function renderPal(q) {
    pal.innerHTML = '';
    CMDS.filter(function (c) { return !q || c.indexOf(q) === 0; }).forEach(function (c, i) {
      var d = document.createElement('div');
      if (i === 0) d.className = 'sel';
      var b = document.createElement('b'); b.textContent = c;
      d.appendChild(b);
      d.addEventListener('click', function () { run(c); });
      pal.appendChild(d);
    });
  }
  function addLine(text, cls) {
    var d = document.createElement('div');
    d.className = 'ln ' + (cls || '');
    d.textContent = text;
    out.appendChild(d);
    while (out.children.length > 40) out.removeChild(out.firstChild);
  }
  function run(cmd) {
    palOpen = false; pal.classList.remove('open');
    var seq = SCRIPTS[cmd] || null;
    if (!seq) {
      addLine('$ ' + cmd, 'la');
      addLine('unknown command — try: ' + CMDS.join(' · '), 'lr');
      return;
    }
    var i = 0;
    (function next() {
      if (i >= seq.length) return;
      addLine(seq[i][0], seq[i][1]);
      i++;
      setTimeout(next, 240);
    })();
  }
  if (tin) {
    tin.addEventListener('keydown', function (ev) {
      if (ev.key === '/') { ev.preventDefault(); palOpen = !palOpen; pal.classList.toggle('open', palOpen); if (palOpen) renderPal(''); }
      else if (ev.key === 'Tab' && palOpen) {
        ev.preventDefault();
        var opts = pal.querySelectorAll('div'); if (!opts.length) return;
        palIdx = (palIdx + 1) % opts.length;
        opts.forEach(function (o) { o.classList.remove('sel'); });
        opts[palIdx].classList.add('sel');
        tin.value = opts[palIdx].textContent;
      } else if (ev.key === 'Enter') {
        if (palOpen) { var sel = pal.querySelector('.sel'); run(sel ? sel.textContent : tin.value); }
        else run(tin.value.trim());
        tin.value = ''; palIdx = 0;
      } else if (ev.key === 'Escape' && palOpen) { palOpen = false; pal.classList.remove('open'); }
    });
    $('#term').addEventListener('click', function () { tin.focus(); });
    // boot: half of submit on first view
    var boot = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        boot.disconnect();
        addLine('# real dispatch capture — g8s, task 6a605f76 · press / for commands', 'lc');
        addLine('lease claimed (CAS) · worktree isolated · receipt sealed', 'lp');
        addLine('{"ok":true,"harness":"g8s"} · 5.86s', 'lp');
      });
    }, { threshold: 0.4 });
    boot.observe($('#term'));
  }
})();
