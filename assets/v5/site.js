/* FlowAxon v5 interactions — CSP-clean (no eval, no inline handlers).
   Data law: every number on the page links a real artifact. */
(function () {
  'use strict';

  /* ── 0. RECURSION GUARD (BT-4) ── */
  var search = window.location.search || '';
  if (search.indexOf('embed=1') !== -1) {
    var built = document.getElementById('builtby');
    if (built && built.parentNode) {
      built.parentNode.removeChild(built);
    }
  }

  var $ = function (s) { return document.querySelector(s); };

  /* ── theme ── */
  var tgl = $('#tgl'), lbl = $('#tglLbl');
  function setTheme(dark) {
    document.documentElement.toggleAttribute('data-theme', !!dark);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    if (lbl) lbl.textContent = dark ? 'Blueprint' : 'Paper';
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

  /* ── ACT I: Build Theater logic moved to assets/v5/theater.js (SRI-hashed) ── */

  /* ── ACT II: Rig v3 logic lives in assets/v5/rig3.js ── */

  /* ── ACT III: terminal drill — real capture, task 6a605f76 ── */
  var out = $('#termOut'), tin = $('#termIn'), pal = $('#pal');
  var SCRIPTS = {
    submit: [
      ['$ g8s submit --idempotency-key demo-1 --prompt "inventory the module" --permission read_only', 'lc'],
      ['  → one task enters the queue, carrying its own permission slip', 'c'],
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
    if (!pal) return;
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
    if (!out) return;
    var d = document.createElement('div');
    d.className = 'ln ' + (cls || '');
    d.textContent = text;
    out.appendChild(d);
    while (out.children.length > 40) out.removeChild(out.firstChild);
  }
  function run(cmd) {
    if (pal) { palOpen = false; pal.classList.remove('open'); }
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
      if (ev.key === '/') { ev.preventDefault(); palOpen = !palOpen; if (pal) pal.classList.toggle('open', palOpen); if (palOpen) renderPal(''); }
      else if (ev.key === 'Tab' && palOpen) {
        ev.preventDefault();
        var opts = pal ? pal.querySelectorAll('div') : []; if (!opts.length) return;
        palIdx = (palIdx + 1) % opts.length;
        opts.forEach(function (o) { o.classList.remove('sel'); });
        opts[palIdx].classList.add('sel');
        tin.value = opts[palIdx].textContent;
      } else if (ev.key === 'Enter') {
        if (palOpen && pal) { var sel = pal.querySelector('.sel'); run(sel ? sel.textContent : tin.value); }
        else run(tin.value.trim());
        tin.value = ''; palIdx = 0;
      } else if (ev.key === 'Escape' && palOpen) { palOpen = false; if (pal) pal.classList.remove('open'); }
    });
    var termEl = $('#term');
    if (termEl) termEl.addEventListener('click', function () { tin.focus(); });
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
    if (termEl) boot.observe(termEl);
  }
})();
