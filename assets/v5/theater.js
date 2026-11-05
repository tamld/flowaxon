/* FlowAxon v5 — Build Theater (Act I)
   Mechanic: Scaled 0.25 live iframe self-assembly (?embed=1) inside a 16:10 frame.
   Choreography: Ledger-driven clip-path reveal map in commit order from ledger.json.
   Invariants: Zero-dep, CSP-clean, WCAG compliant, B7 motion law, strict recursion guard. */
(function () {
  'use strict';

  /* ── 1. RECURSION GUARD (BT-4) ── */
  var search = window.location.search || '';
  if (search.indexOf('embed=1') !== -1) {
    var selfSection = document.getElementById('builtby');
    if (selfSection && selfSection.parentNode) {
      selfSection.parentNode.removeChild(selfSection);
    }
    return;
  }

  /* ── 2. REVEAL MAP (1:1 with assets/v5/ledger.json rows) ── */
  var REVEAL_MAP = [
    {
      row: 0,
      wave: 'W0 · RESEARCH',
      sha: null,
      target: 'header-doctrine',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 12%, 0% 12%)',
      human: 'Doctrine before pixels: established brand brief, 20-dimension design audit, and directive ledger across 4 g8s waves.',
      seal: 'seal-sealed'
    },
    {
      row: 1,
      wave: 'WAVE 1',
      sha: 'a7278f6',
      target: 'hero-scaffold',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 24%, 0% 24%)',
      human: 'Homepage v4 scaffolded: 9 sections created, zero inline styles enforced, CSP-first, 6-stage CI green.',
      seal: 'seal-sealed'
    },
    {
      row: 2,
      wave: 'WAVE 2',
      sha: 'e7a2258',
      target: 'root-swap-stats',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 36%, 0% 36%)',
      human: 'Root swap to production: v4 becomes site root with OG metadata, edge deploy badge, and strict SRI hash gate.',
      seal: 'seal-sealed'
    },
    {
      row: 3,
      wave: 'WAVE 3',
      sha: 'c32b740',
      target: 'cf-pipeline-divider1',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 46%, 0% 46%)',
      human: 'CF Pages pipeline self-healed: automated project creation before deploy, token isolation, and _headers parity.',
      seal: 'seal-sealed'
    },
    {
      row: 4,
      wave: 'WAVE 4',
      sha: '0db265c',
      target: 'edge-load-k6',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 56%, 0% 56%)',
      human: 'Edge load verified: k6 benchmark recorded on pages.dev with 124ms p95 latency and 0% failures.',
      seal: 'seal-sealed'
    },
    {
      row: 5,
      wave: 'WAVE 5',
      sha: 'fed3c24',
      target: 'actions-hardened',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 66%, 0% 66%)',
      human: 'CI pipeline hardened: GitHub Actions pinned to immutable commit SHAs, setup-go v7, and Node 24 native.',
      seal: 'seal-sealed'
    },
    {
      row: 6,
      wave: 'CUTOVER',
      sha: '1b7405f',
      target: 'edge-cutover-rig',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 76%, 0% 76%)',
      human: 'Edge production cutover: live on flowaxon.com with 166ms p95 latency and zero origin fallback by design.',
      seal: 'seal-sealed'
    },
    {
      row: 7,
      wave: 'HOTFIX',
      sha: '9569a90',
      target: 'csp-clean-toggle',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 86%, 0% 86%)',
      human: 'CSP hotfix sealed: converted inline promo style to scoped CSS class and recomputed SRI integrity hash.',
      seal: 'seal-sealed'
    },
    {
      row: 8,
      wave: 'V4.1',
      sha: '3c6e0b6',
      target: 'surface-hardening',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 94%, 0% 94%)',
      human: 'Public surface hardened: pruned internal Aegis references from public surface to maintain strict boundary separation.',
      seal: 'seal-sealed'
    },
    {
      row: 9,
      wave: 'V5.0',
      sha: '1112cd4',
      target: 'v5-self-assembly',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      human: 'V5 self-assembly goes live: site rebuilt itself through the exact g8s containment harness it documents.',
      seal: 'seal-sealed'
    }
  ];

  /* ── 3. BT-1 ASSERTION (1:1 ledger↔reveal integrity) ── */
  function assertBT1(ledgerRows, revealMap) {
    if (!ledgerRows || !revealMap) {
      throw new Error('BT-1 assertion failed: missing ledger rows or reveal map');
    }
    if (ledgerRows.length !== revealMap.length) {
      throw new Error('BT-1 assertion failed: row count (' + ledgerRows.length + ') != reveal map count (' + revealMap.length + ')');
    }
    for (var i = 0; i < ledgerRows.length; i++) {
      var lRow = ledgerRows[i];
      var rRow = revealMap[i];
      if (lRow.wave !== rRow.wave) {
        throw new Error('BT-1 assertion failed at row ' + i + ': wave mismatch ("' + lRow.wave + '" vs "' + rRow.wave + '")');
      }
      if ((lRow.sha || null) !== (rRow.sha || null)) {
        throw new Error('BT-1 assertion failed at row ' + i + ': sha mismatch ("' + lRow.sha + '" vs "' + rRow.sha + '")');
      }
    }
    window.__BT_1_ASSERT_OK = true;
    return true;
  }

  /* ── 4. DOM ELEMENTS ── */
  var theaterSection = document.getElementById('builtby');
  if (!theaterSection) return;

  var theaterCard = document.getElementById('theaterCard');
  var theaterViewport = document.getElementById('theaterViewport');
  var theaterFrame = document.getElementById('theaterFrame');
  var theaterFallback = document.getElementById('theaterFallback');
  var theaterHud = document.getElementById('theaterHud');
  var theaterChipText = document.getElementById('theaterChipText');
  var scrub = document.getElementById('theaterScrub');
  var playBtn = document.getElementById('theaterPlay');
  var posLbl = document.getElementById('theaterPos');
  var stripSha = document.getElementById('stripSha');
  var stripWave = document.getElementById('stripWave');
  var stripLine = document.getElementById('stripLine');
  var stripSeal = document.getElementById('stripSeal');
  var ledgerEl = document.getElementById('ledger');

  var ledgerData = null;
  var rowElements = [];
  var isPlaying = false;
  var rafId = null;
  var autoDuration = 12000; // 12 seconds per plan
  var currentStep = 0;
  var initialized = false;

  /* ── 5. RENDER CURRENT STEP (0..9) ── */
  function renderStep(idx, progressT) {
    if (idx < 0) idx = 0;
    if (idx >= REVEAL_MAP.length) idx = REVEAL_MAP.length - 1;
    currentStep = idx;

    var step = REVEAL_MAP[idx];
    var clip = step.clipPath;

    // Apply clip-path to live iframe and fallback
    if (theaterFrame) theaterFrame.style.clipPath = clip;
    if (theaterFallback) theaterFallback.style.clipPath = clip;

    // Update HUD chip
    if (theaterChipText) {
      theaterChipText.textContent = (step.sha ? '#' + step.sha + ' · ' : '') + step.wave;
    }

    // Update active commit human-line strip
    if (stripSha) stripSha.textContent = step.sha ? '#' + step.sha : 'DOCS';
    if (stripWave) stripWave.textContent = step.wave;
    if (stripLine) stripLine.textContent = step.human;
    if (stripSeal) {
      var use = stripSeal.querySelector('use');
      if (use) use.setAttribute('href', '/assets/v5/seals.svg#' + step.seal);
    }

    // Update ledger row states
    rowElements.forEach(function (el, i) {
      el.classList.toggle('active', i === idx);
      el.classList.toggle('sealed', i <= idx);
      el.classList.toggle('pending', i > idx);
    });

    // End crossfade state when reaching final step at 100%
    var isEnd = (idx === REVEAL_MAP.length - 1 && (progressT === undefined || progressT >= 0.98));
    if (theaterViewport) theaterViewport.classList.toggle('assembled', isEnd);
    if (theaterCard) theaterCard.classList.toggle('assembled', isEnd);

    // Update position readout and range slider aria
    var tSec = progressT !== undefined ? (progressT * 12).toFixed(1) : ((idx + 1) * 1.2).toFixed(1);
    if (posLbl) {
      posLbl.textContent = 't+' + tSec + 's (' + (idx + 1) + '/' + REVEAL_MAP.length + ')';
    }
    if (scrub) {
      scrub.setAttribute('aria-valuenow', Math.round((progressT !== undefined ? progressT : (idx / 9)) * 1000));
      scrub.setAttribute('aria-valuetext', 'Step ' + (idx + 1) + ' of ' + REVEAL_MAP.length + ': ' + step.wave + ' · ' + step.human);
    }
  }

  function paintFromNormalized(t) {
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    var count = REVEAL_MAP.length;
    var idx = Math.min(count - 1, Math.floor(t * count));
    renderStep(idx, t);
  }

  /* ── 6. PLAY / PAUSE CONTROLS ── */
  function stopPlayback() {
    isPlaying = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (playBtn) playBtn.textContent = '▶ play';
  }

  function startPlayback() {
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Reduced motion: jump directly to static end-frame
      if (scrub) scrub.value = 1000;
      paintFromNormalized(1.0);
      return;
    }

    // If already at end, restart from beginning
    if (scrub && parseInt(scrub.value, 10) >= 995) {
      scrub.value = 0;
    }

    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸ pause';

    var startVal = scrub ? parseInt(scrub.value, 10) / 1000 : 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.min(1, startVal + (elapsed / autoDuration));

      if (scrub) scrub.value = Math.round(t * 1000);
      paintFromNormalized(t);

      if (t < 1 && isPlaying) {
        rafId = requestAnimationFrame(step);
      } else {
        stopPlayback();
      }
    }
    rafId = requestAnimationFrame(step);
  }

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (isPlaying) stopPlayback();
      else startPlayback();
    });
  }

  if (scrub) {
    scrub.addEventListener('input', function () {
      stopPlayback();
      var t = parseInt(scrub.value, 10) / 1000;
      paintFromNormalized(t);
    });
  }

  /* ── 7. BUILD LEDGER DOM FROM DATA ── */
  function buildLedgerDOM(rows) {
    if (!ledgerEl) return;
    ledgerEl.replaceChildren();
    rowElements = [];

    rows.forEach(function (row, i) {
      var reveal = REVEAL_MAP[i];
      var div = document.createElement('div');
      div.className = 'wave theater-row pending';
      div.setAttribute('data-idx', String(i));
      div.setAttribute('tabindex', '0');
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', 'Scrub to step ' + (i + 1) + ': ' + row.wave);

      // Left column: wave title + hash chip
      var left = document.createElement('div');
      left.className = 'wave-left';

      var w = document.createElement('span');
      w.className = 'w';
      var bullet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      bullet.setAttribute('class', 'bullet-seal');
      bullet.setAttribute('viewBox', '0 0 14 14');
      bullet.setAttribute('aria-hidden', 'true');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '/assets/v5/seals.svg#seal-bullet');
      bullet.appendChild(use);
      w.appendChild(bullet);
      w.appendChild(document.createTextNode(row.wave));
      left.appendChild(w);

      var chip = document.createElement('span');
      chip.className = 'hash-chip';
      chip.textContent = row.sha ? '#' + row.sha : 'DOCS';
      left.appendChild(chip);

      // Center column: title + human line + details + link
      var d = document.createElement('div');
      d.className = 'd';

      var titleBox = document.createElement('div');
      titleBox.className = 'd-title-box';
      var b = document.createElement('b');
      b.textContent = row.title;
      titleBox.appendChild(b);
      d.appendChild(titleBox);

      var humanP = document.createElement('p');
      humanP.className = 'd-human-line';
      humanP.textContent = reveal.human;
      d.appendChild(humanP);

      var metaBox = document.createElement('div');
      metaBox.className = 'd-meta-box';
      var detSpan = document.createElement('span');
      detSpan.className = 'd-detail-text';
      detSpan.textContent = row.detail;
      metaBox.appendChild(detSpan);

      if (row.url) {
        var a = document.createElement('a');
        a.href = row.url;
        a.textContent = row.sha ? row.sha + ' · commit' : 'browse';
        a.target = '_blank';
        a.rel = 'noopener';
        metaBox.appendChild(a);
      }
      d.appendChild(metaBox);

      // Right column: receipt seal glyph
      var sealDiv = document.createElement('div');
      sealDiv.className = 'wave-seal-col';
      var sealSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      sealSvg.setAttribute('class', 'row-seal-glyph');
      sealSvg.setAttribute('viewBox', '0 0 236 28');
      sealSvg.setAttribute('aria-hidden', 'true');
      var sealUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      sealUse.setAttribute('href', '/assets/v5/seals.svg#seal-sealed');
      sealSvg.appendChild(sealUse);
      sealDiv.appendChild(sealSvg);

      div.appendChild(left);
      div.appendChild(d);
      div.appendChild(sealDiv);

      // Click or keyboard Enter scrubs to this commit
      div.addEventListener('click', function () {
        stopPlayback();
        var t = (i + 0.5) / REVEAL_MAP.length;
        if (scrub) scrub.value = Math.round(t * 1000);
        paintFromNormalized(t);
      });
      div.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          stopPlayback();
          var t = (i + 0.5) / REVEAL_MAP.length;
          if (scrub) scrub.value = Math.round(t * 1000);
          paintFromNormalized(t);
        }
      });

      ledgerEl.appendChild(div);
      rowElements.push(div);
    });
  }

  /* ── 8. LAZY-INIT VIA INTERSECTION OBSERVER ── */
  function initializeTheater() {
    if (initialized) return;
    initialized = true;

    // Set scaled 0.25 iframe src with recursion guard parameter ?embed=1
    if (theaterFrame) {
      var pathname = window.location.pathname || '/';
      var embedUrl = pathname + (pathname.indexOf('?') === -1 ? '?embed=1' : '&embed=1');
      theaterFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
      theaterFrame.src = embedUrl;
    }

    // Fetch ledger.json and run BT-1 gate assert
    fetch('/assets/v5/ledger.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        ledgerData = data;
        assertBT1(data.rows, REVEAL_MAP);
        buildLedgerDOM(data.rows);

        var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
          if (scrub) scrub.value = 1000;
          paintFromNormalized(1.0);
        } else {
          // Initial frame
          paintFromNormalized(0.0);
          // Auto-play once when scrolled into view
          startPlayback();
        }
      })
      .catch(function (err) {
        if (ledgerEl) {
          ledgerEl.textContent = 'Build ledger unavailable (' + err.message + ') — see github.com/tamld/flowaxon/commits/main';
        }
      });
  }

  // IntersectionObserver for lazy-init
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.disconnect();
          initializeTheater();
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.1 });
    observer.observe(theaterSection);
  } else {
    initializeTheater();
  }
})();
