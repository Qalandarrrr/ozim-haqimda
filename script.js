/* ==========================================
   PORTFOLIO JS — Qalandar Sattarberdiev
========================================== */

/* ===== PAGE ROUTER ===== */
function navigateTo(pageId) {
  const validPages = ['home', 'projects', 'contact'];
  if (!validPages.includes(pageId)) return;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('active');

  // Re-trigger fade-in-up elements
  target.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });

  // Update all nav links (desktop + mobile)
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // Close mobile nav
  closeMobileNav();

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update hash
  history.pushState(null, '', '#' + pageId);

  // Stagger project cards
  if (pageId === 'projects') {
    requestAnimationFrame(staggerCards);
  }
}

/* ===== ATTACH NAVIGATION ===== */
function attachNavListeners() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });
}
attachNavListeners();

/* ===== HASH ROUTING ===== */
function handleHash() {
  const hash = window.location.hash.replace('#', '');
  const valid = ['home', 'projects', 'contact'];
  navigateTo(valid.includes(hash) ? hash : 'home');
}
window.addEventListener('popstate', handleHash);
handleHash();

/* ===== STICKY HEADER ===== */
const header = document.getElementById('main-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== HAMBURGER / MOBILE NAV ===== */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');

function openMobileNav() {
  hamburger.classList.add('open');
  mobileNav.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  // Prevent body scroll while nav is open
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
});

// Close when clicking outside
document.addEventListener('click', e => {
  if (mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
});

// Close mobile nav if window resizes past breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) closeMobileNav();
}, { passive: true });

/* ===== PROJECT CARD STAGGER ===== */
function staggerCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'none';
    setTimeout(() => {
      card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 70);
  });
}

/* ===== PROJECT CARD CLICK (ripple) ===== */
function openProject(card) {
  const link = card.dataset.link;
  if (link && link !== '#') {
    window.open(link, '_blank', 'noopener');
    return;
  }
  // Ripple effect for demo cards
  const r = document.createElement('div');
  r.className = 'card-ripple';
  card.appendChild(r);
  setTimeout(() => r.remove(), 650);
}

// Inject ripple style once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .card-ripple {
    position: absolute; inset: 0; border-radius: inherit;
    background: rgba(255,255,255,0.1);
    animation: cardRipple 0.65s ease-out forwards;
    pointer-events: none; z-index: 5;
  }
  @keyframes cardRipple {
    from { opacity: 1; transform: scale(0.9); }
    to   { opacity: 0; transform: scale(1.05); }
  }
`;
document.head.appendChild(rippleStyle);

/* ===== HOME — ENTRANCE ANIMATIONS ===== */
function animateHomeEntrance() {
  const els = document.querySelectorAll(
    '#page-home .hero-tag, #page-home .hero-name, #page-home .hero-subtitle, ' +
    '#page-home .info-item, #page-home .interests-section, #page-home .btn-primary'
  );
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 250 + i * 90);
  });
}

/* ===== CURSOR GLOW (desktop only) ===== */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
initCursorGlow();

/* ===== INTERSECTION OBSERVER — fade cards on scroll ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('io-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Observe interest tags and info items for subtle scroll reveals
document.querySelectorAll('.interest-tag, .info-item').forEach(el => {
  io.observe(el);
});

const ioStyle = document.createElement('style');
ioStyle.textContent = `
  .interest-tag, .info-item {
    transition: opacity 0.4s ease, transform 0.4s ease,
                border-color 0.3s ease, background 0.3s ease;
  }
`;
document.head.appendChild(ioStyle);

/* ===== RUN ON DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  animateHomeEntrance();
});
