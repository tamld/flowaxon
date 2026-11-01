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

  /* ── ACT II: rig descent ── */
  var rig3 = $('#rig3'), rigNote = $('#rigNote');
  var layerText = {
    F2: 'F2 · subtask sandbox — worktree isolated, receipt-jail, killable process group',
    F1: 'F1 · executor — CAS lease claimed, single-use write receipt, no horizontal edges',
    F0: 'F0 · architect — full trust, the only tier that commits. You are here.'
  };
  function descend(layer) {
    var on = rig3.classList.contains('descend');
    var active = rig3.getAttribute('data-desc') === layer;
    if (on && active) { // pull back
      rig3.classList.remove('descend'); rig3.removeAttribute('data-desc');
      rigNote.textContent = 'click any plane to descend';
    } else {
      rig3.classList.add('descend'); rig3.setAttribute('data-desc', layer);
      rigNote.textContent = layerText[layer] || '';
    }
  }
  if (rig3) rig3.querySelectorAll('.plane').forEach(function (pl) {
    pl.addEventListener('click', function () { descend(pl.getAttribute('data-layer')); });
    pl.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); descend(pl.getAttribute('data-layer')); }
    });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && rig3 && rig3.classList.contains('descend')) descend(rig3.getAttribute('data-desc'));
  });

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
