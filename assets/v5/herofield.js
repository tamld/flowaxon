/* HERO-01 Containment Field — deterministic (seeded PRNG), purposeful.
   Packets (agent actions) drift inward and STOP at a ring: they "ask permission"
   (pulse amber), then proceed — scroll controls how deep packets may go.
   The visual IS the thesis: control, not chaos. */
(function () {
  var cv = document.getElementById('field');
  if (!cv) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = cv.getContext('2d');
  var W = 640, CX = 320, CY = 320;
  var RINGS = [200, 150, 100, 52]; // F0 core last

  // seeded PRNG (mulberry32) — deterministic composition
  var s = 0x20261101;
  function rnd() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // theme-aware colors read from CSS custom properties
  function col(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var packets = [];
  for (var i = 0; i < 9; i++) {
    var a = rnd() * Math.PI * 2;
    var speed = 0.25 + rnd() * 0.4;
    packets.push({
      angle: a, speed: speed,
      dist: 300 + rnd() * 20,          // start outside outer ring
      gate: RINGS[Math.floor(rnd() * RINGS.length)], // the ring it must ask at
      asked: false, approved: 0,        // 0 waiting, >0 progress after approval
      size: 3 + rnd() * 4
    });
  }

  var scrollGate = 0.15; // base permission depth
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    scrollGate = 0.15 + p * 0.5; // deeper scroll → deeper permission
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var t0 = null;
  function frame(ts) {
    if (!t0) t0 = ts;
    var t = (ts - t0) / 1000;
    var amber = col('--amber', '#8a5c06');
    var green = col('--green', '#2e7d54');
    var line = col('--bd2', '#c9c1b1');

    ctx.clearRect(0, 0, W, W);

    // rings
    for (var r = 0; r < RINGS.length; r++) {
      ctx.beginPath();
      ctx.arc(CX, CY, RINGS[r], 0, Math.PI * 2);
      ctx.strokeStyle = (r === 2) ? amber : line;
      ctx.globalAlpha = (r === 2) ? 0.6 : 0.8;
      ctx.setLineDash(r === 2 ? [4, 7] : [5, 9]);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // core
    ctx.beginPath();
    ctx.arc(CX, CY, 5, 0, Math.PI * 2);
    ctx.fillStyle = amber;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    // packets: drift inward, pause at gate ring (ask permission), pulse, then proceed
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];
      var allowed = 300 - scrollGate * 260; // scroll-driven permission depth
      var target = Math.max(p.gate, allowed);

      if (p.dist > target) {
        p.dist -= p.speed;
        p.asked = false;
      } else if (Math.abs(p.dist - target) < 1.5 && !p.asked) {
        // at the gate: ask
        p.asked = true;
        p.approved = t;
      }
      if (p.asked && t - p.approved > 1.2 && scrollGate > 0.3) {
        p.dist -= p.speed * 0.5; // approved after pause — continue slowly
      }
      if (p.dist < p.gate - 6) { // reset cycle: new packet from outside
        p.dist = 305; p.asked = false;
        p.angle = rnd() * Math.PI * 2;
        p.gate = RINGS[Math.floor(rnd() * RINGS.length)];
      }

      var x = CX + Math.cos(p.angle) * p.dist;
      var y = CY + Math.sin(p.angle) * p.dist;

      // draw packet
      ctx.beginPath();
      ctx.rect(x - p.size / 2, y - p.size / 4, p.size, p.size / 2);
      ctx.fillStyle = p.asked ? amber : green;
      ctx.globalAlpha = p.asked ? 0.95 : 0.55;
      ctx.fill();

      // permission pulse at gate
      if (p.asked && t - p.approved < 1.2) {
        var pr = (t - p.approved) / 1.2;
        ctx.beginPath();
        ctx.arc(x, y, 6 + pr * 14, 0, Math.PI * 2);
        ctx.strokeStyle = amber;
        ctx.globalAlpha = (1 - pr) * 0.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
