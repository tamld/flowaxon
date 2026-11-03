/**
 * Rig v3 — Hand-Rolled Canvas2D Isometric Vector Engine
 * Specification: docs/research/24-3d-storytelling-research.md (Route a)
 * 
 * Features:
 * - Real 3D coordinate system projected through an isometric affine matrix
 * - Constrained gimbal orbit [-35°, +35°] with inertial spring damping
 * - Depth-ordered rendering (Painter's algorithm)
 * - 10-event motion grammar (E1 SPAWN&CHARGE -> E10 MERGE&FLATTEN, 12s loop)
 * - Accessible DOM overlay for keyboard navigation and screen-readers
 * - Click-to-descend per containment tier (F0, F1, F2) with camera glide
 * - Packet freeze toggle (Space / K / Click)
 * - Reduced motion static architectural blueprint fallback
 * - 390px mobile responsive adaptation with overflow:clip containment
 * - Real telemetry: task 6a605f76, receipt 96fd2088, result_hash 99bcdd7e, 60s lease, 5.86s
 * - Zero external dependencies, CSP-clean (no eval, no inline style tags)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    var exports = factory();
    root.project3D = exports.project3D;
    root.Rig3 = exports.Rig3;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DEG2RAD = Math.PI / 180;
  var COS30 = Math.cos(30 * DEG2RAD); // sqrt(3)/2 ≈ 0.8660254037844386
  var SIN30 = Math.sin(30 * DEG2RAD); // 0.5
  var MAX_PARTICLES = 40;

  var TELEMETRY = {
    taskId: '6a605f76',
    taskFull: '6a605f76-8a88-4b7f-a457-df194c6775e6',
    receiptHash: '96fd2088',
    receiptFull: '96fd2088fe80da90',
    resultHash: '99bcdd7e',
    duration: '5.86s',
    leaseSeconds: 60,
    worktree: 'wt-69c9b6e4'
  };

  var ANATOMY_DATA = {
    F0: {
      title: 'F0 · ARCHITECT / COORDINATOR',
      role: 'Charter Issuance & Human Confirmation',
      items: [
        'Full trust authority — the only tier that commits to the master repository.',
        'Issues signed immutable briefs, consumes cryptographic write receipts.',
        'Zero direct edges to F2 sandbox (F0 ↔ F2 = 0) — sees verified evidence, never touches raw workspace files.',
        ['ADR-0032 — Containment Levels', 'https://github.com/tamld/g8s/blob/main/docs/decisions/0032-containment-levels.md']
      ]
    },
    F1: {
      title: 'F1 · EXECUTOR / LEASE-HOLDER',
      role: 'Atomic CAS Lease & Write Receipt Press',
      items: [
        'Claims tasks with an atomic Compare-And-Swap (CAS) lease — single winner guarantee.',
        'Writes sealed by single-use, path-scoped cryptographic receipts.',
        'Zero horizontal edges (F1 ↔ F1 = 0) — isolated workers execute frozen briefs without peer cross-talk.',
        ['g8s Harness Architecture', 'https://github.com/tamld/g8s']
      ]
    },
    F2: {
      title: 'F2 · SANDBOX / WORKER',
      role: 'Isolated Ephemeral Process Group & Worktree',
      items: [
        'Ephemeral git worktree isolated per subtask execution.',
        'Killable OS process group (Setpgid) with strict execution boundaries.',
        'Zero-trust receipt jail: AllowedPaths enforced in-process, mutations require seal verification.',
        ['Cardinality Law (1:1:1)', 'https://github.com/tamld/g8s']
      ]
    }
  };

  /**
   * Pure 3D affine isometric projection function.
   * Projects (x, y, z) into 2D screen coordinates with camera gimbal rotation and focus.
   *
   * @param {number} x - 3D X coordinate
   * @param {number} y - 3D Y coordinate
   * @param {number} z - 3D Z coordinate
   * @param {object} [cam] - Camera state { pitch, yaw, focusY, scale }
   * @param {object} [vp] - Viewport center { cx, cy, scale }
   * @returns {{ x: number, y: number, depth: number, x2d: number, y2d: number }}
   */
  function project3D(x, y, z, cam, vp) {
    cam = cam || {};
    vp = vp || {};

    var pitch = cam.pitch || 0;
    var yaw = cam.yaw || 0;
    var focusY = cam.focusY || 0;
    var s = cam.scale !== undefined ? cam.scale : (vp.scale !== undefined ? vp.scale : 1);
    var cx = vp.cx !== undefined ? vp.cx : (cam.cx !== undefined ? cam.cx : 0);
    var cy = vp.cy !== undefined ? vp.cy : (cam.cy !== undefined ? cam.cy : 0);

    var x0 = x;
    var y0 = y - focusY;
    var z0 = z;

    // Yaw rotation around Y axis
    var cosY = Math.cos(yaw);
    var sinY = Math.sin(yaw);
    var x1 = x0 * cosY + z0 * sinY;
    var y1 = y0;
    var z1 = -x0 * sinY + z0 * cosY;

    // Pitch rotation around X axis
    var cosP = Math.cos(pitch);
    var sinP = Math.sin(pitch);
    var x2 = x1;
    var y2 = y1 * cosP - z1 * sinP;
    var z2 = y1 * sinP + z1 * cosP;

    // Standard affine isometric projection
    var sx = cx + (x2 - z2) * COS30 * s;
    var sy = cy + (x2 + z2) * SIN30 * s - y2 * s;
    var depth = x2 + z2 + 2 * y2;

    return {
      x: sx,
      y: sy,
      depth: depth,
      x2d: sx,
      y2d: sy
    };
  }

  // Cubic Bezier evaluation for 3D splines
  function bezier3D(p0, p1, p2, p3, t) {
    var mt = 1 - t;
    var mt2 = mt * mt;
    var t2 = t * t;
    var a = mt2 * mt;
    var b = 3 * mt2 * t;
    var c = 3 * mt * t2;
    var d = t2 * t;
    return {
      x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
      y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
      z: a * p0.z + b * p1.z + c * p2.z + d * p3.z
    };
  }

  // Conduit spline control points per specification §4.1
  var DISPATCH_SPLINE_1 = [
    { x: 0, y: 100, z: 80 },  // F0 center
    { x: 30, y: 60, z: 50 },
    { x: 15, y: 20, z: 10 },
    { x: 0, y: 0, z: 0 }     // F1 center
  ];
  var DISPATCH_SPLINE_2 = [
    { x: 0, y: 0, z: 0 },     // F1 center
    { x: 15, y: -40, z: -30 },
    { x: 30, y: -70, z: -60 },
    { x: 0, y: -100, z: -80 } // F2 center
  ];
  var RETURN_SPLINE = [
    { x: 0, y: 0, z: 0 },       // F1 center
    { x: -45, y: 40, z: 20 },   // Lateral bypass offset ΔX = -45px
    { x: -25, y: 80, z: 60 },
    { x: 0, y: 100, z: 80 }     // F0 center
  ];

  function getDispatchPoint(t) {
    if (t <= 0.5) {
      return bezier3D(DISPATCH_SPLINE_1[0], DISPATCH_SPLINE_1[1], DISPATCH_SPLINE_1[2], DISPATCH_SPLINE_1[3], t * 2);
    }
    return bezier3D(DISPATCH_SPLINE_2[0], DISPATCH_SPLINE_2[1], DISPATCH_SPLINE_2[2], DISPATCH_SPLINE_2[3], (t - 0.5) * 2);
  }

  function getReturnPoint(t) {
    return bezier3D(RETURN_SPLINE[0], RETURN_SPLINE[1], RETURN_SPLINE[2], RETURN_SPLINE[3], Math.max(0, Math.min(1, t)));
  }

  // Web Audio acoustic micro-synthesis bridge (§6.2)
  var audioCtx = null;
  function initAudio() {
    if (audioCtx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {}
  }
  function playTick() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);
      filter.Q.setValueAtTime(8, audioCtx.currentTime);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.02);
    } catch (e) {}
  }
  function playPluck(freq) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq || 587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  }
  function playThump() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(52, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, audioCtx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.32);
    } catch (e) {}
  }
  function playClack() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      var bufferSize = Math.floor(audioCtx.sampleRate * 0.01);
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      var noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  /**
   * Main Rig v3 Class
   */
  function Rig3(options) {
    options = options || {};
    this.container = document.querySelector(options.container || '#rig3');
    if (!this.container) return;

    this.canvas = this.container.querySelector('canvas') || document.createElement('canvas');
    if (!this.canvas.parentElement) this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.overlay = this.container.querySelector('#rigOverlay');
    this.noteEl = document.querySelector(options.noteEl || '#rigNote');
    this.anatomyEl = document.querySelector(options.anatomyEl || '#anatomy');

    this.camera = {
      pitch: 0,
      yaw: 0,
      targetPitch: 0,
      targetYaw: 0,
      focusY: 0,
      targetFocusY: 0,
      scale: 1
    };

    this.viewport = {
      width: 0,
      height: 0,
      cx: 0,
      cy: 0,
      dpr: 1
    };

    this.state = {
      time: 0,
      loopDuration: 12000,
      frozen: false,
      descended: null, // 'F0' | 'F1' | 'F2' | null
      activeEvent: 'E1',
      lastAudioEvent: '',
      leaseRemaining: 60,
      f2WallHeight: 0, // 0..40
      sealProgress: [0, 0, 0], // s1, s2, s3
      particles: [],
      gateAngle: 0
    };

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rafId = null;
    this.isRunning = false;
    this.lastTime = 0;
    this.lastInteractionTime = Date.now();

    this.init();
  }

  Rig3.prototype.init = function () {
    var self = this;

    this.resize();
    window.addEventListener('resize', function () { self.resize(); });

    // Drag-to-orbit gimbal interactions
    var dragging = false, startX = 0, startY = 0, moved = 0, dragMoved = false;
    var maxAngle = 35 * DEG2RAD; // [-35°, +35°]

    this.container.addEventListener('pointerdown', function (ev) {
      initAudio();
      dragging = true;
      dragMoved = false;
      moved = 0;
      startX = ev.clientX;
      startY = ev.clientY;
      self.lastInteractionTime = Date.now();
      self.container.classList.add('dragging');
      try { self.container.setPointerCapture(ev.pointerId); } catch (e) {}
    });

    window.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6) dragMoved = true;

      // Gimbal rotation: azimuth (yaw) and elevation (pitch)
      self.camera.targetYaw = Math.max(-maxAngle, Math.min(maxAngle, self.camera.yaw + dx * 0.005));
      self.camera.targetPitch = Math.max(-maxAngle, Math.min(maxAngle, self.camera.pitch - dy * 0.005));
      startX = ev.clientX;
      startY = ev.clientY;
      self.lastInteractionTime = Date.now();
    });

    function stopDrag() {
      if (dragging) {
        dragging = false;
        self.container.classList.remove('dragging');
        self.lastInteractionTime = Date.now();
        setTimeout(function () { dragMoved = false; }, 50);
      }
    }
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    // Overlay button hooks
    if (this.overlay) {
      this.overlay.querySelectorAll('.rig-tier-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          initAudio();
          var layer = btn.getAttribute('data-layer');
          self.descend(layer);
        });
      });

      var pktBtn = this.overlay.querySelector('#btnPacket');
      if (pktBtn) {
        pktBtn.addEventListener('click', function () {
          initAudio();
          self.toggleFreeze();
        });
      }
    }

    // Keyboard shortcuts: 0, 1, 2, Space, K, Escape
    window.addEventListener('keydown', function (ev) {
      if (ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA')) return;
      if (ev.key === '0') {
        self.descend('F0');
      } else if (ev.key === '1') {
        self.descend('F1');
      } else if (ev.key === '2') {
        self.descend('F2');
      } else if (ev.key === ' ' || ev.key === 'k' || ev.key === 'K') {
        // Toggle pause/freeze if rig is visible
        var rect = self.container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          ev.preventDefault();
          self.toggleFreeze();
        }
      } else if (ev.key === 'Escape') {
        if (self.state.descended) {
          self.descend(null);
        }
      }
    });

    // IntersectionObserver to pause RAF when off-screen
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          self.start();
        } else {
          self.stop();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(this.container);

    // Reduced motion listener
    var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.addEventListener) {
      mql.addEventListener('change', function (e) {
        self.reducedMotion = e.matches;
        self.renderStaticBlueprint();
      });
    }

    if (this.reducedMotion) {
      this.renderStaticBlueprint();
    } else {
      this.start();
    }
  };

  Rig3.prototype.resize = function () {
    var rect = this.container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    this.viewport.width = rect.width;
    this.viewport.height = rect.height;
    this.viewport.cx = rect.width / 2;
    this.viewport.cy = rect.height / 2;
    this.viewport.dpr = dpr;

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Mobile scale adaptation (survives 390px without horizontal overflow)
    if (rect.width < 480) {
      this.camera.scale = Math.max(0.68, rect.width / 520);
    } else if (rect.width < 720) {
      this.camera.scale = 0.88;
    } else {
      this.camera.scale = 1.05;
    }

    if (this.reducedMotion && !this.isRunning) {
      this.renderStaticBlueprint();
    }
  };

  Rig3.prototype.descend = function (layer) {
    if (this.state.descended === layer || !layer) {
      // Pull back to home
      this.state.descended = null;
      this.camera.targetFocusY = 0;
      this.container.removeAttribute('data-desc');
      if (this.anatomyEl) this.anatomyEl.classList.remove('show');
    } else {
      // Descend into layer
      this.state.descended = layer;
      this.container.setAttribute('data-desc', layer);
      if (layer === 'F0') this.camera.targetFocusY = 100;
      else if (layer === 'F1') this.camera.targetFocusY = 0;
      else if (layer === 'F2') this.camera.targetFocusY = -100;

      this.showAnatomy(layer);
    }

    // Update overlay active states
    if (this.overlay) {
      this.overlay.querySelectorAll('.rig-tier-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-layer') === layer);
      });
    }

    if (this.reducedMotion && !this.isRunning) {
      this.renderStaticBlueprint();
    }
  };

  Rig3.prototype.showAnatomy = function (layer) {
    if (!this.anatomyEl || !ANATOMY_DATA[layer]) return;
    var data = ANATOMY_DATA[layer];
    var html = '<h4>' + data.title + '</h4>';
    html += '<p><strong>' + data.role + '</strong></p><ul>';
    data.items.forEach(function (item) {
      if (Array.isArray(item)) {
        html += '<li><a href="' + item[1] + '" target="_blank" rel="noopener">' + item[0] + '</a></li>';
      } else {
        html += '<li>' + item + '</li>';
      }
    });
    html += '</ul>';
    this.anatomyEl.innerHTML = html;
    this.anatomyEl.classList.add('show');
  };

  Rig3.prototype.toggleFreeze = function () {
    this.state.frozen = !this.state.frozen;
    var pktBtn = this.overlay ? this.overlay.querySelector('#btnPacket') : null;
    if (pktBtn) pktBtn.classList.toggle('frozen', this.state.frozen);

    if (this.noteEl) {
      if (this.state.frozen) {
        this.noteEl.innerHTML = '<strong>frozen</strong> — this state is a law: <b>1 issue = 1 worker = 1 receipt</b>. click packet or press Space to resume';
      } else {
        this.noteEl.innerHTML = 'resumed — the packet continues its containment cycle';
      }
    }
  };

  Rig3.prototype.start = function () {
    if (this.isRunning || this.reducedMotion) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    var self = this;

    function loop(ts) {
      if (!self.isRunning) return;
      var dt = Math.min(64, ts - self.lastTime);
      self.lastTime = ts;

      self.update(dt);
      self.render();

      self.rafId = requestAnimationFrame(loop);
    }
    this.rafId = requestAnimationFrame(loop);
  };

  Rig3.prototype.stop = function () {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  // 10-Event Motion Grammar Update Loop
  Rig3.prototype.update = function (dt) {
    if (!this.state.frozen) {
      this.state.time = (this.state.time + dt) % this.state.loopDuration;
    }

    var t = this.state.time;
    var eventName = 'E1';
    var noteText = '';
    var activeChip = '';

    // E1: 00.0s – 01.2s (0 - 1200ms) SPAWN & CHARGE
    if (t < 1200) {
      eventName = 'E1';
      noteText = '<b>F0</b> · <b>task_submitted</b> — brief issued · task ' + TELEMETRY.taskId + ' · role scout (read_only)';
      activeChip = 'c-f0';
      this.state.leaseRemaining = 60;
      this.state.f2WallHeight = 0;
      this.state.sealProgress = [0, 0, 0];
      if (this.state.lastAudioEvent !== 'E1') {
        playTick();
        playPluck(587.33); // D5
        this.state.lastAudioEvent = 'E1';
      }
    }
    // E2: 01.2s – 02.0s (1200 - 2000ms) PLUNGE & STRETCH
    else if (t < 2000) {
      eventName = 'E2';
      noteText = '<b>F0 → F1</b> · dispatch transit down primary conduit rail';
      activeChip = 'c-f0';
      this.state.leaseRemaining = 60;
      this.state.f2WallHeight = 0;
      this.state.sealProgress = [0, 0, 0];
      this.state.lastAudioEvent = 'E2';
    }
    // E3: 02.0s – 04.5s (2000 - 4500ms) LATCH & COUNTDOWN
    else if (t < 4500) {
      eventName = 'E3';
      var elapsedLease = (t - 2000) / 2500;
      this.state.leaseRemaining = Math.max(57, Math.round(60 - elapsedLease * 3));
      noteText = '<b>F1</b> · <b>task_claimed</b> — CAS lease ' + this.state.leaseRemaining + 's claimed (token b9f379a2…) · affinity agy';
      activeChip = 'c-lease';
      this.state.f2WallHeight = 0;
      this.state.sealProgress = [0, 0, 0];
      if (this.state.lastAudioEvent !== 'E3') {
        playClack();
        playTick();
        this.state.lastAudioEvent = 'E3';
      }
    }
    // E4: 04.5s – 05.2s (4500 - 5200ms) EXTRUDE & ENCLOSE
    else if (t < 5200) {
      eventName = 'E4';
      var uWall = (t - 4500) / 700;
      this.state.f2WallHeight = 40 * Math.sin(uWall * Math.PI * 0.5);
      noteText = '<b>F2</b> · worktree forking · Setpgid process isolation extrudes boundary walls';
      activeChip = 'c-work';
      if (this.state.lastAudioEvent !== 'E4') {
        playThump();
        this.state.lastAudioEvent = 'E4';
      }
    }
    // E5: 05.2s – 07.5s (5200 - 7500ms) TRIAD ORBIT (& E6 Seals)
    else if (t < 7500) {
      eventName = 'E5';
      this.state.f2WallHeight = 40;
      noteText = '<b>F2</b> · <b>task_started</b> — worktree ' + TELEMETRY.worktree + ' isolated · AllowedPaths enforced';
      activeChip = 'c-work';

      // E6: Seal Stamps at 5700ms, 6300ms, 6900ms
      if (t >= 5700) {
        this.state.sealProgress[0] = Math.min(1, (t - 5700) / 200);
        if (this.state.lastAudioEvent !== 'E6_1') { playPluck(698.46); this.state.lastAudioEvent = 'E6_1'; } // F5
      }
      if (t >= 6300) {
        this.state.sealProgress[1] = Math.min(1, (t - 6300) / 200);
        if (this.state.lastAudioEvent !== 'E6_2') { playPluck(880.00); this.state.lastAudioEvent = 'E6_2'; } // A5
      }
      if (t >= 6900) {
        this.state.sealProgress[2] = Math.min(1, (t - 6900) / 200);
        if (this.state.lastAudioEvent !== 'E6_3') { playPluck(1046.50); this.state.lastAudioEvent = 'E6_3'; } // C6
      }
    }
    // E7: 07.5s – 08.5s (7500 - 8500ms) CRYSTALLIZE
    else if (t < 8500) {
      eventName = 'E7';
      noteText = '<b>F1</b> · write receipt <b>' + TELEMETRY.receiptHash + '</b> sealed · single-use, path-scoped';
      activeChip = 'c-receipt';
      this.state.sealProgress = [1, 1, 1];
      if (this.state.lastAudioEvent !== 'E7') {
        playThump();
        playPluck(1174.66); // D6
        this.state.lastAudioEvent = 'E7';
      }
    }
    // E8: 08.5s – 09.5s (8500 - 9500ms) ASCEND & BYPASS
    else if (t < 9500) {
      eventName = 'E8';
      noteText = '<b>F1 → F0</b> · evidence ascension along return telemetry rail (bypasses F2)';
      activeChip = 'c-receipt';
      this.state.lastAudioEvent = 'E8';
    }
    // E9: 09.5s – 11.0s (9500 - 11000ms) PULSE & SCAN
    else if (t < 11000) {
      eventName = 'E9';
      noteText = '<b>F0</b> · <b>attempt_finished</b> · ' + TELEMETRY.duration + ' · result_hash ' + TELEMETRY.resultHash + ' · gate human-confirmed';
      activeChip = 'c-gate';
      if (this.state.lastAudioEvent !== 'E9') {
        playTick();
        this.state.lastAudioEvent = 'E9';
      }
    }
    // E10: 11.0s – 12.0s (11000 - 12000ms) MERGE & FLATTEN
    else {
      eventName = 'E10';
      var uRetract = (t - 11000) / 1000;
      this.state.f2WallHeight = 40 * Math.max(0, 1 - uRetract * 1.5);
      noteText = '<b>F0</b> · <b>WORKER_COMPLETED ✓</b> — 1 issue = 1 worker = 1 receipt';
      activeChip = 'c-merge';
      if (this.state.lastAudioEvent !== 'E10') {
        playPluck(587.33);
        this.state.lastAudioEvent = 'E10';
      }
    }

    this.state.activeEvent = eventName;
    if (this.noteEl && !this.state.frozen) {
      this.noteEl.innerHTML = noteText;
    }

    // Camera inertia and return-to-center decay after 1.5s inactivity
    var now = Date.now();
    if (now - this.lastInteractionTime > 1500) {
      this.camera.targetYaw += (0 - this.camera.targetYaw) * 0.04;
      this.camera.targetPitch += (0 - this.camera.targetPitch) * 0.04;
    }
    this.camera.yaw += (this.camera.targetYaw - this.camera.yaw) * 0.12;
    this.camera.pitch += (this.camera.targetPitch - this.camera.pitch) * 0.12;
    this.camera.focusY += (this.camera.targetFocusY - this.camera.focusY) * 0.08;

    // Optical iris rotation
    this.state.gateAngle += 0.015;

    // Particle update & bounding ≤ 40
    for (var i = this.state.particles.length - 1; i >= 0; i--) {
      var p = this.state.particles[i];
      p.life -= dt * 0.0015;
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      if (p.life <= 0) {
        this.state.particles.splice(i, 1);
      }
    }
    while (this.state.particles.length > MAX_PARTICLES) {
      this.state.particles.shift();
    }
  };

  Rig3.prototype.addParticle = function (x, y, z, vx, vy, vz, color) {
    if (this.state.particles.length >= MAX_PARTICLES) return;
    this.state.particles.push({
      x: x, y: y, z: z,
      vx: vx || (Math.random() - 0.5) * 0.5,
      vy: vy || (Math.random() - 0.5) * 0.5,
      vz: vz || (Math.random() - 0.5) * 0.5,
      color: color || '#8a5c06',
      life: 1.0
    });
  };

  // Render pass with Painter's Algorithm Depth-Sort
  Rig3.prototype.render = function () {
    var ctx = this.ctx;
    var w = this.viewport.width;
    var h = this.viewport.height;
    ctx.clearRect(0, 0, w, h);

    var cam = this.camera;
    var vp = this.viewport;
    var drawList = [];

    // Helper to add drawable with depth
    function addDrawable(depth, drawFn) {
      drawList.push({ depth: depth, draw: drawFn });
    }

    var self = this;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var theme = {
      bd: isDark ? '#2a3644' : '#c9c1b1',
      plate: isDark ? 'rgba(18, 25, 36, 0.92)' : 'rgba(251, 250, 246, 0.95)',
      plateF0: isDark ? 'rgba(25, 34, 48, 0.95)' : 'rgba(245, 242, 234, 0.95)',
      amber: isDark ? '#f0a832' : '#8a5c06',
      amberBg: isDark ? 'rgba(240, 168, 50, 0.15)' : 'rgba(138, 92, 6, 0.12)',
      green: isDark ? '#57c48f' : '#2e7d54',
      grid: isDark ? 'rgba(120, 150, 190, 0.12)' : 'rgba(70, 80, 97, 0.12)',
      shadow: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(24, 26, 31, 0.08)'
    };

    // 1. Conduit Rails
    addDrawable(-100, function () {
      self.drawConduitRails(ctx, cam, vp, theme);
    });

    // 2. F2 Tier (Sandbox Worker, Y = -100, Z = -80)
    var pF2 = project3D(0, -100, -80, cam, vp);
    addDrawable(pF2.depth - 20, function () {
      self.drawTierF2(ctx, cam, vp, theme);
    });

    // 3. F1 Tier (Executor, Y = 0, Z = 0)
    var pF1 = project3D(0, 0, 0, cam, vp);
    addDrawable(pF1.depth, function () {
      self.drawTierF1(ctx, cam, vp, theme);
    });

    // 4. F0 Tier (Architect, Y = 100, Z = 80)
    var pF0 = project3D(0, 100, 80, cam, vp);
    addDrawable(pF0.depth + 20, function () {
      self.drawTierF0(ctx, cam, vp, theme);
    });

    // 5. Dynamic Actor (Packet / Triad / Receipt)
    var actorPos = this.getActorCoordinates();
    if (actorPos) {
      var pActor = project3D(actorPos.x, actorPos.y, actorPos.z, cam, vp);
      addDrawable(pActor.depth + 30, function () {
        self.drawDynamicActor(ctx, cam, vp, theme, actorPos, pActor);
      });
    }

    // 6. Particles
    if (this.state.particles.length > 0) {
      this.state.particles.forEach(function (pt) {
        var pPt = project3D(pt.x, pt.y, pt.z, cam, vp);
        addDrawable(pPt.depth + 35, function () {
          ctx.save();
          ctx.globalAlpha = Math.max(0, pt.life) * 0.8;
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pPt.x, pPt.y, 2 * cam.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      });
    }

    // Painter's algorithm depth sort
    drawList.sort(function (a, b) { return a.depth - b.depth; });
    for (var i = 0; i < drawList.length; i++) {
      drawList[i].draw();
    }

    // Sync accessible DOM overlay positions
    this.syncDOMOverlay(pF0, pF1, pF2, actorPos ? project3D(actorPos.x, actorPos.y, actorPos.z, cam, vp) : pF0);
  };

  // Draw F0 Tier (Architect)
  Rig3.prototype.drawTierF0 = function (ctx, cam, vp, theme) {
    var corners = [
      project3D(-85, 100, -50, cam, vp),
      project3D(85, 100, -50, cam, vp),
      project3D(85, 100, 50, cam, vp),
      project3D(-85, 100, 50, cam, vp)
    ];

    // Plate shadow
    ctx.save();
    ctx.fillStyle = theme.shadow;
    ctx.beginPath();
    ctx.moveTo(corners[0].x - 6, corners[0].y + 8);
    for (var i = 1; i < 4; i++) ctx.lineTo(corners[i].x - 6, corners[i].y + 8);
    ctx.closePath();
    ctx.fill();

    // Plate body
    var isDesc = this.state.descended === 'F0';
    ctx.fillStyle = theme.plateF0;
    ctx.strokeStyle = isDesc ? theme.amber : theme.bd;
    ctx.lineWidth = isDesc ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (var j = 1; j < 4; j++) ctx.lineTo(corners[j].x, corners[j].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Concentric Optical Iris Gate Ring at center (0, 100, 80)
    var pCenter = project3D(0, 100, 0, cam, vp);
    var isGateActive = (this.state.activeEvent === 'E9' || this.state.activeEvent === 'E1');
    ctx.strokeStyle = isGateActive ? theme.amber : (isDesc ? theme.amber : theme.green);
    ctx.lineWidth = isGateActive ? 2 : 1;
    ctx.beginPath();
    var rOuter = 26 * cam.scale;
    var rInner = 14 * cam.scale;
    ctx.ellipse(pCenter.x, pCenter.y, rOuter, rOuter * 0.58, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(pCenter.x, pCenter.y, rInner, rInner * 0.58, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Iris aperture blades
    ctx.save();
    ctx.strokeStyle = isGateActive ? theme.amber : theme.bd;
    for (var k = 0; k < 6; k++) {
      var angle = this.state.gateAngle + (k * Math.PI / 3);
      var rx1 = pCenter.x + Math.cos(angle) * rInner;
      var ry1 = pCenter.y + Math.sin(angle) * rInner * 0.58;
      var rx2 = pCenter.x + Math.cos(angle + 0.5) * rOuter;
      var ry2 = pCenter.y + Math.sin(angle + 0.5) * rOuter * 0.58;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }
    ctx.restore();

    // Commit Ledger Cylinder SSoT at (50, 100, 20)
    var pLedger = project3D(50, 100, 20, cam, vp);
    var pLedgerTop = project3D(50, 114, 20, cam, vp);
    ctx.strokeStyle = theme.bd;
    ctx.fillStyle = theme.plate;
    var cylR = 12 * cam.scale;
    // cylinder body
    ctx.beginPath();
    ctx.ellipse(pLedger.x, pLedger.y, cylR, cylR * 0.55, 0, 0, Math.PI);
    ctx.lineTo(pLedgerTop.x - cylR, pLedgerTop.y);
    ctx.ellipse(pLedgerTop.x, pLedgerTop.y, cylR, cylR * 0.55, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // cylinder cap
    ctx.beginPath();
    ctx.ellipse(pLedgerTop.x, pLedgerTop.y, cylR, cylR * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  // Draw F1 Tier (Executor)
  Rig3.prototype.drawTierF1 = function (ctx, cam, vp, theme) {
    var corners = [
      project3D(-85, 0, -50, cam, vp),
      project3D(85, 0, -50, cam, vp),
      project3D(85, 0, 50, cam, vp),
      project3D(-85, 0, 50, cam, vp)
    ];

    ctx.save();
    // Plate shadow
    ctx.fillStyle = theme.shadow;
    ctx.beginPath();
    ctx.moveTo(corners[0].x - 8, corners[0].y + 10);
    for (var i = 1; i < 4; i++) ctx.lineTo(corners[i].x - 8, corners[i].y + 10);
    ctx.closePath();
    ctx.fill();

    // Plate body
    var isDesc = this.state.descended === 'F1';
    ctx.fillStyle = theme.plate;
    ctx.strokeStyle = isDesc ? theme.amber : theme.bd;
    ctx.lineWidth = isDesc ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (var j = 1; j < 4; j++) ctx.lineTo(corners[j].x, corners[j].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mechanical CAS Socket Calipers at (0, 0, 0)
    var pCenter = project3D(0, 0, 0, cam, vp);
    var isClamped = (this.state.activeEvent === 'E3' || this.state.activeEvent === 'E7');
    var caliperDist = (isClamped ? 10 : 20) * cam.scale;

    ctx.strokeStyle = isClamped ? theme.amber : theme.bd;
    ctx.lineWidth = 1.5;
    // 4 Calipers
    var caliperAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    for (var k = 0; k < 4; k++) {
      var ca = caliperAngles[k];
      var cx1 = pCenter.x + Math.cos(ca) * (caliperDist + 12 * cam.scale);
      var cy1 = pCenter.y + Math.sin(ca) * (caliperDist + 12 * cam.scale) * 0.58;
      var cx2 = pCenter.x + Math.cos(ca) * caliperDist;
      var cy2 = pCenter.y + Math.sin(ca) * caliperDist * 0.58;
      ctx.beginPath();
      ctx.moveTo(cx1, cy1);
      ctx.lineTo(cx2, cy2);
      ctx.stroke();
    }

    // Holographic Lease Dial (displays 60s countdown)
    if (this.state.activeEvent === 'E3') {
      ctx.fillStyle = theme.amber;
      ctx.font = 'bold ' + Math.round(13 * cam.scale) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.state.leaseRemaining + 's CAS', pCenter.x, pCenter.y - 18 * cam.scale);
    }

    ctx.restore();
  };

  // Draw F2 Tier (Sandbox Worker)
  Rig3.prototype.drawTierF2 = function (ctx, cam, vp, theme) {
    var corners = [
      project3D(-85, -100, -50, cam, vp),
      project3D(85, -100, -50, cam, vp),
      project3D(85, -100, 50, cam, vp),
      project3D(-85, -100, 50, cam, vp)
    ];

    ctx.save();
    // Plate shadow
    ctx.fillStyle = theme.shadow;
    ctx.beginPath();
    ctx.moveTo(corners[0].x - 10, corners[0].y + 12);
    for (var i = 1; i < 4; i++) ctx.lineTo(corners[i].x - 10, corners[i].y + 12);
    ctx.closePath();
    ctx.fill();

    // Plate body
    var isDesc = this.state.descended === 'F2';
    ctx.fillStyle = theme.plate;
    ctx.strokeStyle = isDesc ? theme.amber : theme.bd;
    ctx.lineWidth = isDesc ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (var j = 1; j < 4; j++) ctx.lineTo(corners[j].x, corners[j].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Retina floorplate grid lines (10px increments)
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (var gx = -60; gx <= 60; gx += 20) {
      var gp1 = project3D(gx, -100, -40, cam, vp);
      var gp2 = project3D(gx, -100, 40, cam, vp);
      ctx.beginPath();
      ctx.moveTo(gp1.x, gp1.y);
      ctx.lineTo(gp2.x, gp2.y);
      ctx.stroke();
    }
    for (var gz = -30; gz <= 30; gz += 15) {
      var gp3 = project3D(-70, -100, gz, cam, vp);
      var gp4 = project3D(70, -100, gz, cam, vp);
      ctx.beginPath();
      ctx.moveTo(gp3.x, gp3.y);
      ctx.lineTo(gp4.x, gp4.y);
      ctx.stroke();
    }

    // 3 Seal Pedestals (s1, s2, s3)
    var seals = [
      { x: 30, z: -20, p: this.state.sealProgress[0] },
      { x: 50, z: 0,   p: this.state.sealProgress[1] },
      { x: 30, z: 20,  p: this.state.sealProgress[2] }
    ];
    for (var s = 0; s < 3; s++) {
      var seal = seals[s];
      var pSeal = project3D(seal.x, -100, seal.z, cam, vp);
      var active = seal.p > 0;
      ctx.fillStyle = active ? theme.green : theme.bd;
      ctx.strokeStyle = active ? theme.amber : theme.bd;
      ctx.beginPath();
      ctx.arc(pSeal.x, pSeal.y, 4 * cam.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Shockwave ripple ring
      if (seal.p > 0 && seal.p < 1) {
        ctx.strokeStyle = theme.amber;
        ctx.beginPath();
        var rippleR = (4 + seal.p * 18) * cam.scale;
        ctx.ellipse(pSeal.x, pSeal.y, rippleR, rippleR * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Extrudable Hexagonal Boundary Walls (E4 / E5)
    var wallH = this.state.f2WallHeight;
    if (wallH > 0.5) {
      var hexRadius = 45;
      var hexPtsBottom = [];
      var hexPtsTop = [];
      for (var hx = 0; hx < 6; hx++) {
        var ha = (hx * 60) * DEG2RAD;
        var hxX = Math.cos(ha) * hexRadius;
        var hxZ = Math.sin(ha) * hexRadius;
        hexPtsBottom.push(project3D(hxX, -100, hxZ, cam, vp));
        hexPtsTop.push(project3D(hxX, -100 + wallH, hxZ, cam, vp));
      }

      ctx.fillStyle = theme.amberBg;
      ctx.strokeStyle = theme.amber;
      ctx.lineWidth = 1;

      // Hex wall facets
      for (var f = 0; f < 6; f++) {
        var next = (f + 1) % 6;
        ctx.beginPath();
        ctx.moveTo(hexPtsBottom[f].x, hexPtsBottom[f].y);
        ctx.lineTo(hexPtsTop[f].x, hexPtsTop[f].y);
        ctx.lineTo(hexPtsTop[next].x, hexPtsTop[next].y);
        ctx.lineTo(hexPtsBottom[next].x, hexPtsBottom[next].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  // Draw 3D Conduit Rails
  Rig3.prototype.drawConduitRails = function (ctx, cam, vp, theme) {
    ctx.save();
    ctx.lineWidth = 1.4;

    // 1. Dispatch Rail (F0 -> F1 -> F2)
    ctx.strokeStyle = theme.bd;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    var steps = 30;
    for (var i = 0; i <= steps; i++) {
      var pt = getDispatchPoint(i / steps);
      var pScrn = project3D(pt.x, pt.y, pt.z, cam, vp);
      if (i === 0) ctx.moveTo(pScrn.x, pScrn.y);
      else ctx.lineTo(pScrn.x, pScrn.y);
    }
    ctx.stroke();

    // 2. Return Rail (F1 -> F0, Lateral bypass ΔX = -45px)
    ctx.strokeStyle = theme.green;
    ctx.beginPath();
    for (var j = 0; j <= steps; j++) {
      var rpt = getReturnPoint(j / steps);
      var rpScrn = project3D(rpt.x, rpt.y, rpt.z, cam, vp);
      if (j === 0) ctx.moveTo(rpScrn.x, rpScrn.y);
      else ctx.lineTo(rpScrn.x, rpScrn.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  };

  // Calculate dynamic 3D actor coordinates based on loop time
  Rig3.prototype.getActorCoordinates = function () {
    var t = this.state.time;
    // E1: at F0
    if (t < 1200) {
      return { x: 0, y: 100, z: 0, type: 'packet', scale: Math.min(1, t / 400) };
    }
    // E2: plunge down dispatch rail
    if (t < 2000) {
      var u = (t - 1200) / 800;
      var pos = getDispatchPoint(u * 0.5); // F0 to F1 is first half
      return { x: pos.x, y: pos.y, z: pos.z, type: 'plunge', stretch: 1.8 };
    }
    // E3: at F1 CAS socket
    if (t < 4500) {
      return { x: 0, y: 0, z: 0, type: 'packet', scale: 1 };
    }
    // E4: descending F1 to F2
    if (t < 5200) {
      var u4 = (t - 4500) / 700;
      var pos4 = getDispatchPoint(0.5 + u4 * 0.5);
      return { x: pos4.x, y: pos4.y, z: pos4.z, type: 'packet', scale: 1 };
    }
    // E5 / E6: Triad Orbit in F2 Sandbox
    if (t < 7500) {
      var angle = ((t - 5200) * 0.0035);
      return { x: 0, y: -100, z: 0, type: 'triad', angle: angle, r: 28 };
    }
    // E7: Crystallize at F1
    if (t < 8500) {
      return { x: 0, y: 0, z: 0, type: 'crystal', sealed: true };
    }
    // E8: Ascend along return rail
    if (t < 9500) {
      var u8 = (t - 8500) / 1000;
      var pos8 = getReturnPoint(u8);
      return { x: pos8.x, y: pos8.y, z: pos8.z, type: 'crystal', sealed: true };
    }
    // E9 / E10: At F0 Gate Confirmation / Merge
    return { x: 0, y: 100, z: 0, type: 'crystal', sealed: true };
  };

  // Draw Dynamic Actor (Packet / Triad / Crystal)
  Rig3.prototype.drawDynamicActor = function (ctx, cam, vp, theme, actorPos, pScrn) {
    ctx.save();
    var s = cam.scale;

    if (actorPos.type === 'triad') {
      // 3 Orbiting subtask execution orbs
      var a = actorPos.angle;
      var orbs = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
      for (var k = 0; k < 3; k++) {
        var oa = a + orbs[k];
        var ox = actorPos.x + Math.cos(oa) * actorPos.r;
        var oz = actorPos.z + Math.sin(oa) * actorPos.r;
        var pOrb = project3D(ox, actorPos.y, oz, cam, vp);

        ctx.fillStyle = theme.amber;
        ctx.beginPath();
        ctx.arc(pOrb.x, pOrb.y, 4.5 * s, 0, Math.PI * 2);
        ctx.fill();

        // Deposit trail micro-particles
        if (Math.random() < 0.25) {
          this.addParticle(ox, actorPos.y, oz, 0, 0, 0, theme.amber);
        }
      }
    } else if (actorPos.type === 'crystal') {
      // Emerald Faceted Prism Receipt
      ctx.fillStyle = theme.green;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      var cW = 14 * s, cH = 18 * s;
      ctx.beginPath();
      ctx.moveTo(pScrn.x, pScrn.y - cH * 0.5);
      ctx.lineTo(pScrn.x + cW * 0.5, pScrn.y);
      ctx.lineTo(pScrn.x, pScrn.y + cH * 0.5);
      ctx.lineTo(pScrn.x - cW * 0.5, pScrn.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crystal facet line
      ctx.beginPath();
      ctx.moveTo(pScrn.x - cW * 0.5, pScrn.y);
      ctx.lineTo(pScrn.x + cW * 0.5, pScrn.y);
      ctx.stroke();
    } else {
      // Amber Gold Pill Capsule
      var pw = 16 * s;
      var ph = (actorPos.stretch ? 24 : 12) * s;
      ctx.fillStyle = theme.amber;
      ctx.strokeStyle = theme.amber;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(pScrn.x, pScrn.y, pw * 0.5, ph * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer glowing halo
      ctx.strokeStyle = theme.amberBg;
      ctx.lineWidth = 4 * s;
      ctx.stroke();
    }

    ctx.restore();
  };

  // Sync accessible DOM overlay buttons
  Rig3.prototype.syncDOMOverlay = function (pF0, pF1, pF2, pActor) {
    if (!this.overlay) return;

    var btnF0 = this.overlay.querySelector('#btnTierF0');
    var btnF1 = this.overlay.querySelector('#btnTierF1');
    var btnF2 = this.overlay.querySelector('#btnTierF2');
    var btnPkt = this.overlay.querySelector('#btnPacket');

    if (btnF0) {
      btnF0.style.left = Math.round(pF0.x - 70) + 'px';
      btnF0.style.top = Math.round(pF0.y) + 'px';
    }
    if (btnF1) {
      btnF1.style.left = Math.round(pF1.x - 70) + 'px';
      btnF1.style.top = Math.round(pF1.y) + 'px';
    }
    if (btnF2) {
      btnF2.style.left = Math.round(pF2.x - 70) + 'px';
      btnF2.style.top = Math.round(pF2.y) + 'px';
    }
    if (btnPkt && pActor) {
      btnPkt.style.left = Math.round(pActor.x) + 'px';
      btnPkt.style.top = Math.round(pActor.y) + 'px';
    }
  };

  // Reduced motion static architectural blueprint frame (§6.4)
  Rig3.prototype.renderStaticBlueprint = function () {
    var ctx = this.ctx;
    var w = this.viewport.width;
    var h = this.viewport.height;
    ctx.clearRect(0, 0, w, h);

    var cam = this.camera;
    var vp = this.viewport;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var theme = {
      bd: isDark ? '#2a3644' : '#c9c1b1',
      plate: isDark ? 'rgba(18, 25, 36, 0.92)' : 'rgba(251, 250, 246, 0.95)',
      plateF0: isDark ? 'rgba(25, 34, 48, 0.95)' : 'rgba(245, 242, 234, 0.95)',
      amber: isDark ? '#f0a832' : '#8a5c06',
      green: isDark ? '#57c48f' : '#2e7d54',
      grid: isDark ? 'rgba(120, 150, 190, 0.12)' : 'rgba(70, 80, 97, 0.12)',
      shadow: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(24, 26, 31, 0.08)'
    };

    // Draw conduits with static dashed vectors
    this.drawConduitRails(ctx, cam, vp, theme);

    // Draw all 3 tiers in exploded architectural blueprint format
    this.drawTierF2(ctx, cam, vp, theme);
    this.drawTierF1(ctx, cam, vp, theme);
    this.drawTierF0(ctx, cam, vp, theme);

    // Numbered static callout badges: 1: Brief, 2: Lease, 3: Worktree Sandbox, 4: Receipt
    var callouts = [
      { text: '1: BRIEF (F0)', pos: project3D(0, 100, 80, cam, vp) },
      { text: '2: LEASE (F1)', pos: project3D(0, 0, 0, cam, vp) },
      { text: '3: SANDBOX (F2)', pos: project3D(0, -100, -80, cam, vp) },
      { text: '4: RECEIPT (F1→F0)', pos: project3D(-45, 40, 20, cam, vp) }
    ];

    ctx.save();
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    callouts.forEach(function (c) {
      ctx.fillStyle = theme.plate;
      ctx.strokeStyle = theme.amber;
      ctx.lineWidth = 1;
      var textWidth = ctx.measureText(c.text).width;
      ctx.fillRect(c.pos.x - textWidth / 2 - 4, c.pos.y - 12, textWidth + 8, 16);
      ctx.strokeRect(c.pos.x - textWidth / 2 - 4, c.pos.y - 12, textWidth + 8, 16);
      ctx.fillStyle = theme.amber;
      ctx.fillText(c.text, c.pos.x, c.pos.y);
    });
    ctx.restore();

    var pF0 = project3D(0, 100, 80, cam, vp);
    var pF1 = project3D(0, 0, 0, cam, vp);
    var pF2 = project3D(0, -100, -80, cam, vp);
    this.syncDOMOverlay(pF0, pF1, pF2, pF0);

    if (this.noteEl) {
      this.noteEl.textContent = 'Static blueprint — animation paused (prefers-reduced-motion). Tab or click planes to inspect.';
    }
  };

  // Auto-init on DOMContentLoaded if #rig3 exists
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelector('#rig3')) {
          window.rig3Instance = new Rig3();
        }
      });
    } else {
      if (document.querySelector('#rig3')) {
        window.rig3Instance = new Rig3();
      }
    }
  }

  return {
    project3D: project3D,
    Rig3: Rig3
  };
});
