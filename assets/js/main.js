(function () {
  var root = document.documentElement;
  var motionOn = function () { return root.getAttribute('data-motion') !== 'off'; };
  var store = function (key, value) { try { localStorage.setItem(key, value); } catch (e) {} };

  // Theme and animation toggles
  function syncToggles() {
    document.querySelectorAll('[data-toggle][aria-pressed]').forEach(function (b) {
      var on = b.dataset.toggle === 'motion' ? motionOn() : root.classList.contains('dark');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var fs = e.target.closest('[data-fullscreen]');
    if (fs) {
      var frame = document.getElementById(fs.dataset.fullscreen);
      if (frame && frame.requestFullscreen) frame.requestFullscreen();
      return;
    }
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    if (btn.dataset.toggle === 'theme') {
      store('darkMode', root.classList.toggle('dark'));
    } else if (btn.dataset.toggle === 'motion') {
      var next = motionOn() ? 'off' : 'on';
      root.setAttribute('data-motion', next);
      store('motion', next);
      if (next === 'off') stopTypewriters();
    }
    syncToggles();
  });
  syncToggles();

  // "auto" theme follows the system until the visitor picks one
  if (root.getAttribute('data-default-theme') === 'auto' && window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('darkMode'); } catch (err) {}
      if (saved === null) { root.classList.toggle('dark', e.matches); syncToggles(); }
    });
  }

  // Menus
  var menus = document.querySelectorAll('details[data-menu]');
  document.addEventListener('click', function (e) {
    menus.forEach(function (d) {
      if (d.open && (!d.contains(e.target) || e.target.closest('a'))) d.open = false;
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    menus.forEach(function (d) {
      if (d.open) { d.open = false; d.querySelector('summary').focus(); }
    });
  });

  // Section fade-in
  var sections = document.querySelectorAll('section[data-animate]');
  if ('IntersectionObserver' in window) {
    // Seuil 0 + marge : une section plus haute que l'écran n'atteint jamais un seuil en %.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 15% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add('fade-in-visible'); });
  }

  // Hero shapes follow the pointer
  var hero = document.querySelector('.hero-section');
  if (hero && window.matchMedia && matchMedia('(hover: hover)').matches) {
    var frame = 0, px = 0, py = 0;
    hero.addEventListener('pointermove', function (e) {
      if (!motionOn()) return;
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(function () {
        frame = 0;
        hero.style.setProperty('--mx', px.toFixed(3));
        hero.style.setProperty('--my', py.toFixed(3));
        hero.classList.add('is-tracking');
      });
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--mx', 0);
      hero.style.setProperty('--my', 0);
      hero.classList.remove('is-tracking');
    });
  }

  // Typewriter
  var timers = [];
  var typewriters = document.querySelectorAll('.typewriter');
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopTypewriters() {
    timers.forEach(clearTimeout);
    timers = [];
    typewriters.forEach(function (el) { el.textContent = el.dataset.originalText; });
  }
  typewriters.forEach(function (el) {
    if (!motionOn()) return;
    var text = (el.dataset.originalText || el.textContent).trim();
    var phrases = text.split('. ').map(function (p) { return p.trim(); }).filter(Boolean)
      .map(function (p, i, all) { return i < all.length - 1 && !/[.!?]$/.test(p) ? p + '.' : p; });
    if (!phrases.length) return;

    var h = 0;
    phrases.forEach(function (p) { el.textContent = p; h = Math.max(h, el.offsetHeight); });
    if (h) el.style.minHeight = h + 'px';

    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    function render(s) { el.textContent = s; el.appendChild(cursor); }

    function type(phrase, i, done) {
      render(phrase.slice(0, i));
      if (i < phrase.length) later(function () { type(phrase, i + 1, done); }, 60);
      else done();
    }
    function erase(phrase, i, done) {
      render(phrase.slice(0, i));
      if (i > 0) later(function () { erase(phrase, i - 1, done); }, 30);
      else done();
    }
    function cycle(n) {
      var phrase = phrases[n];
      type(phrase, 0, function () {
        if (phrases.length === 1) return;
        later(function () {
          erase(phrase, phrase.length, function () {
            later(function () { cycle((n + 1) % phrases.length); }, 400);
          });
        }, 2500);
      });
    }
    render('');
    later(function () { cycle(0); }, 300);
  });

  // Back to top
  var toTop = document.querySelector('.back-to-top');
  if (toTop) {
    toTop.hidden = false;
    var ticking = false;
    var update = function () {
      toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight / 2);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: motionOn() ? 'smooth' : 'auto' });
      // Le bouton disparaît : rendre le focus au début de la page.
      var first = document.querySelector('nav a');
      if (first) first.focus({ preventScroll: true });
    });
  }

  // Reveal the page
  root.classList.add('ready');
})();

// Contact form
(function () {
  var form = document.getElementById('contact-form');
  if (!form || !form.action || !window.fetch) return;
  var status = form.querySelector('.form-status');
  function show(key) {
    status.textContent = form.dataset[key];
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (res.ok) { show('msgThanks'); form.reset(); } else { show('msgError'); }
      })
      .catch(function () { show('msgFailed'); });
  });
})();
