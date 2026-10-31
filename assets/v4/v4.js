/**
 * sites/v4/v4.js - Vanilla ES6, Zero Dependencies
 * FlowAxon v4 Engine Client Controller
 * CSP-compliant: external file only, zero inline execution.
 */

(function () {
  'use strict';

  var isReducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* --------------------------------------------------------------------------
     1. Count-Up on IntersectionObserver (900ms, ease-out-cubic)
     -------------------------------------------------------------------------- */
  function initCountUps() {
    var countElements = document.querySelectorAll('[data-count]');
    if (!countElements.length) return;

    var easeOutCubic = function (t) {
      return 1 - Math.pow(1 - t, 3);
    };

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);

        var targetVal = parseFloat(el.getAttribute('data-count') || '0');
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

        if (isReducedMotion()) {
          el.textContent = prefix + targetVal.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }) + suffix;
          return;
        }

        var startTime = performance.now();
        var duration = 900; // 900ms strictly

        function step(now) {
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var currentVal = targetVal * easeOutCubic(progress);

          el.textContent = prefix + currentVal.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }) + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = prefix + targetVal.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            }) + suffix;
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.25 });

    countElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     2. Scroll Reveals & Surf Bar Scale-Y
     -------------------------------------------------------------------------- */
  function initScrollReveals() {
    var revealElements = document.querySelectorAll('.reveal-on-scroll');
    var surfBars = document.querySelectorAll('.surf-bar');

    if (isReducedMotion()) {
      revealElements.forEach(function (el) { el.classList.add('is-revealed'); });
      surfBars.forEach(function (bar) { bar.classList.add('is-revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) { observer.observe(el); });
    surfBars.forEach(function (bar) { observer.observe(bar); });
  }

  /* --------------------------------------------------------------------------
     3. Act I: 48-Hour Scrubber
     -------------------------------------------------------------------------- */
  var SCRUBBER_STAGES = [
    {
      hour: 0,
      label: 'T+00h',
      squad: 'Squad: Incident Command',
      recovered: '0 / 100+ recovered',
      log: 'Nationwide retail ransomware outbreak detected across 100+ endpoints at Thien Nam Hoa. Air-gap isolation initiated. Automated triage underway.'
    },
    {
      hour: 12,
      label: 'T+12h',
      squad: 'Squad 1: Foundation Isolation',
      recovered: '28 / 100+ recovered',
      log: 'Subnet containment sealed lateral movement. Pristine master images deployed to clean foundation hosts. Single-authority gateway verified.'
    },
    {
      hour: 24,
      label: 'T+24h',
      squad: 'Squad 2: ERP & POS Recovery',
      recovered: '64 / 100+ recovered',
      log: 'Parallel execution of automated database reconciliation and headless POS client restoration scripts across regional store clusters.'
    },
    {
      hour: 36,
      label: 'T+36h',
      squad: 'Squad 3: Identity Verification',
      recovered: '92 / 100+ recovered',
      log: 'Zero-trust credential rotation executed. Comprehensive cryptographic integrity verification passes with zero persistence indicators.'
    },
    {
      hour: 48,
      label: 'T+48h',
      squad: 'Unified Operations Clearance',
      recovered: '100+ / 100+ recovered',
      log: 'All stores confirmed operational for Monday morning retail opening. 100+ nodes back in production with zero downtime.'
    }
  ];

  function getScrubberState(hour) {
    for (var i = SCRUBBER_STAGES.length - 1; i >= 0; i--) {
      if (hour >= SCRUBBER_STAGES[i].hour) {
        return SCRUBBER_STAGES[i];
      }
    }
    return SCRUBBER_STAGES[0];
  }

  function initScrubber() {
    var range = document.getElementById('scrubber-range');
    var hourDisplay = document.getElementById('scrubber-hour');
    var squadDisplay = document.getElementById('scrubber-squad');
    var recoveredDisplay = document.getElementById('scrubber-recovered');
    var logDisplay = document.getElementById('scrubber-log');
    var buttons = document.querySelectorAll('.scrubber-btn');

    if (!range || !hourDisplay) return;

    function renderHour(val) {
      var h = parseInt(val, 10);
      var state = getScrubberState(h);

      hourDisplay.textContent = 'T+' + (h < 10 ? '0' : '') + h + ':00';
      if (squadDisplay) squadDisplay.textContent = state.squad;
      if (recoveredDisplay) recoveredDisplay.textContent = state.recovered;
      if (logDisplay) logDisplay.textContent = state.log;

      buttons.forEach(function (btn) {
        var btnVal = parseInt(btn.getAttribute('data-hour') || '0', 10);
        if (btnVal === h || (h >= btnVal && (btnVal === 48 || h < btnVal + 12))) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    range.addEventListener('input', function () {
      renderHour(range.value);
    });

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var h = btn.getAttribute('data-hour');
        range.value = h;
        renderHour(h);
      });
    });

    renderHour(range.value);
  }

  /* --------------------------------------------------------------------------
     4. Act III: The Dispatch Demo (F0 → F1·a/b/c → seal)
     -------------------------------------------------------------------------- */
  function initDispatchDemo() {
    var btn = document.getElementById('btn-dispatch-trigger');
    var flowSteps = document.querySelectorAll('.flow-step');
    var termLines = document.querySelectorAll('.term-line');
    if (!btn || !flowSteps.length) return;

    var currentStep = 0;
    var timer = null;
    var isRunning = false;

    function setStep(step) {
      currentStep = step;

      // Update flow badges
      flowSteps.forEach(function (fs) {
        var fsStep = parseInt(fs.getAttribute('data-step') || '0', 10);
        fs.classList.remove('active', 'sealed');
        if (fsStep === step) {
          fs.classList.add('active');
        } else if (fsStep < step) {
          fs.classList.add('sealed');
        }
      });

      // Update terminal lines
      termLines.forEach(function (tl) {
        var tlStep = parseInt(tl.getAttribute('data-step') || '0', 10);
        tl.classList.remove('active', 'verified');
        if (tlStep <= step && step > 0) {
          tl.classList.add('active');
          if (tlStep === 4 || tlStep === 5) {
            tl.classList.add('verified');
          }
        }
      });

      if (step >= 5) {
        isRunning = false;
        btn.textContent = 'Reset Simulation';
      }
    }

    function runAnimation() {
      if (isReducedMotion()) {
        setStep(5);
        return;
      }

      isRunning = true;
      btn.textContent = 'Executing...';
      var nextStep = 1;
      setStep(nextStep);

      timer = setInterval(function () {
        nextStep++;
        if (nextStep <= 5) {
          setStep(nextStep);
        } else {
          clearInterval(timer);
        }
      }, 700);
    }

    btn.addEventListener('click', function () {
      if (timer) clearInterval(timer);
      if (currentStep >= 5 || isRunning) {
        setStep(0);
        btn.textContent = 'Dispatch Worker (Demo)';
        isRunning = false;
      } else {
        runAnimation();
      }
    });

    setStep(0);
  }

  /* --------------------------------------------------------------------------
     5. Copy Email Button
     -------------------------------------------------------------------------- */
  function initCopyEmail() {
    var copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;
    var email = 'hello@flowaxon.com';

    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyBtn.textContent = 'copied ✓';
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.textContent = 'copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          window.prompt('Copy to clipboard:', email);
        });
      } else {
        window.prompt('Copy to clipboard:', email);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Initialization on DOM ready
     -------------------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCountUps();
      initScrollReveals();
      initScrubber();
      initDispatchDemo();
      initCopyEmail();
    });
  } else {
    initCountUps();
    initScrollReveals();
    initScrubber();
    initDispatchDemo();
    initCopyEmail();
  }
})();

/* promo play toggle */
(function(){
  var b=document.getElementById('promoPlay'),v=document.getElementById('promoFull');
  if(!b||!v)return;
  b.addEventListener('click',function(){
    v.classList.toggle('is-on');
    if(v.classList.contains('is-on')){v.play();b.textContent='✕ hide the promo';}
    else{v.pause();b.textContent='▶ play the promo';}
  });
})();
