/* ─── script.js ─── */

// ════════════════════════════════════════════════════════
// PARTICLE CANVAS
// ════════════════════════════════════════════════════════
(function initParticles() {
  const canvas  = document.getElementById('particle-canvas');
  const ctx     = canvas.getContext('2d');
  let   W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
  }

  function createParticle() {
    return {
      x:       randomBetween(0, W),
      y:       randomBetween(0, H),
      r:       randomBetween(0.5, 2.5),
      speed:   randomBetween(0.15, 0.6),
      alpha:   randomBetween(0.2, 0.8),
      dAlpha:  randomBetween(0.002, 0.008) * (Math.random() > 0.5 ? 1 : -1),
      color:   Math.random() > 0.6 ? '#ff6a00' : '#e50000',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 100 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Move upward slowly
      p.y -= p.speed;
      p.alpha += p.dAlpha;

      // Bounce alpha
      if (p.alpha <= 0.1 || p.alpha >= 0.9) p.dAlpha *= -1;

      // Reset when off screen
      if (p.y < -5) {
        p.y = H + 5;
        p.x = randomBetween(0, W);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });

  init();
  draw();
})();


// ════════════════════════════════════════════════════════
// NAVBAR — scroll effect + active link + mobile toggle
// ════════════════════════════════════════════════════════
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = navLinks.querySelectorAll('.nav-link');
  const btt       = document.getElementById('back-to-top');

  // Scroll effect
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    btt.classList.toggle('visible', y > 400);
  });

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click (mobile)
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active section highlight (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(l => l.classList.remove('active'));
        const active = navLinks.querySelector(`[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));

  // Back to top
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ════════════════════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════════════════════
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => obs.observe(el));
})();


// ════════════════════════════════════════════════════════
// ANIMATED COUNTERS (Hero stats)
// ════════════════════════════════════════════════════════
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let   started  = false;

  function countUp(el, target) {
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    const inc      = target / steps;
    let   current  = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  const heroSection = document.getElementById('hero');

  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !started) {
      started = true;
      counters.forEach(c => countUp(c, +c.dataset.target));
    }
  }, { threshold: 0.5 });

  obs.observe(heroSection);
})();


// ════════════════════════════════════════════════════════
// SKILL BARS
// ════════════════════════════════════════════════════════
(function initSkillBars() {
  const fills    = document.querySelectorAll('.skill-fill[data-width]');
  let   animated = false;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) obs.observe(skillsSection);
})();


// ════════════════════════════════════════════════════════
// SMOOTH CURSOR GLOW (desktop only)
// ════════════════════════════════════════════════════════
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.5s ease, top 0.5s ease;
    left: -200px;
    top: -200px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


// ════════════════════════════════════════════════════════
// LAPTOP SLIDESHOW
// ════════════════════════════════════════════════════════
(function initLaptopSlides() {
  const slides = document.querySelectorAll('.lslide');
  const dots   = document.querySelectorAll('.ldot');
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;

  function goTo(index) {
    slides[current].classList.remove('lslide-active');
    dots[current].classList.remove('ldot-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('lslide-active');
    dots[current].classList.add('ldot-active');
  }

  function next() { goTo(current + 1); }

  // Auto-advance every 4s (after lid opens: ~2s delay)
  function startTimer() {
    timer = setInterval(next, 4000);
  }

  // Start timer after lid animation finishes (0.5s delay + 1.4s open = ~2s)
  setTimeout(startTimer, 2000);

  // Manual dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });
})();
