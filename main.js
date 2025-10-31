// GreenCell Main JavaScript File
// Handles all interactive functionality and animations

document.addEventListener('DOMContentLoaded', function () {
  initializeAnimations();
  initializeCarousels();
  initializeCharts();
  initializeScrollEffects();
  initializeParticleSystem();
  initializeCounters();
  initializeProgressBars();
  wireSmoothAnchors();
  wireNavScrollBG();
  // SDG toggle + Modals are wired below
});

/* =========================
   Animations & UI Effects
   ========================= */

function initializeAnimations() {
  // Typewriter effect for hero text (guard for library)
  if (document.getElementById('typed-text') && typeof Typed !== 'undefined') {
    try {
      new Typed('#typed-text', {
        strings: ['Sustainable Tomorrow', 'Better Future', 'Greener World', 'Sustainable Future'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    } catch (e) { console.warn('Typed init failed:', e); }
  }

  // Animate SDG cards on hover (guard anime)
  const sdgCards = document.querySelectorAll('.sdg-card');
  if (typeof anime !== 'undefined') {
    sdgCards.forEach((card) => {
      card.addEventListener('mouseenter', function () {
        anime({ targets: this, scale: 1.05, rotateY: 5, duration: 300, easing: 'easeOutQuad' });
      });
      card.addEventListener('mouseleave', function () {
        anime({ targets: this, scale: 1, rotateY: 0, duration: 300, easing: 'easeOutQuad' });
      });
    });
  }

  // Animate project cards
  const projectCards = document.querySelectorAll('.project-card');
  if (typeof anime !== 'undefined') {
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', function () {
        anime({
          targets: this,
          translateY: -8,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: 300,
          easing: 'easeOutQuad',
        });
      });
      card.addEventListener('mouseleave', function () {
        anime({
          targets: this,
          translateY: 0,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          duration: 300,
          easing: 'easeOutQuad',
        });
      });
    });
  }

  // Button hover animations
  const buttons = document.querySelectorAll('.btn-primary');
  if (typeof anime !== 'undefined') {
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', function () {
        anime({ targets: this, translateY: -2, scale: 1.02, duration: 200, easing: 'easeOutQuad' });
      });
      button.addEventListener('mouseleave', function () {
        anime({ targets: this, translateY: 0, scale: 1, duration: 200, easing: 'easeOutQuad' });
      });
    });
  }
}

/* =========================
   Carousels
   ========================= */
function initializeCarousels() {
  const el = document.getElementById('projects-carousel');
  if (el && typeof Splide !== 'undefined') {
    try {
      // Avoid double-mounts if other scripts manage Splide
      if (el.splide) { el.splide.refresh(); return; }
      new Splide('#projects-carousel', {
        type: 'loop',
        // Show 3 cards on desktop
        perPage: 3,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        breakpoints: { 1024: { perPage: 2 }, 640: { perPage: 1 } },
      }).mount();
    } catch (e) { console.warn('Splide init failed:', e); }
  }
}

/* =========================
   Charts
   ========================= */
function initializeCharts() {
  const chartElement = document.getElementById('impact-chart');
  if (!chartElement || typeof echarts === 'undefined') return;

  try {
    const chart = echarts.init(chartElement);
    const option = {
      title: {
        text: 'Global Impact by SDG',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
      },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left', textStyle: { fontSize: 12 } },
      series: [
        {
          name: 'Impact Distribution',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: '16', fontWeight: 'bold' },
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
          labelLine: { show: false },
          data: [
            { value: 1048, name: 'Climate Action', itemStyle: { color: '#4ade80' } },
            { value: 735, name: 'Quality Education', itemStyle: { color: '#22c55e' } },
            { value: 580, name: 'Clean Energy', itemStyle: { color: '#16a34a' } },
            { value: 484, name: 'Sustainable Cities', itemStyle: { color: '#15803d' } },
            { value: 300, name: 'Life on Land', itemStyle: { color: '#14532d' } },
          ],
        },
      ],
    };

    chart.setOption(option);

    // Animate chart on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) chart.setOption(option, true);
      });
    });
    observer.observe(chartElement);
  } catch (e) { console.warn('ECharts init failed:', e); }
}

/* =========================
   Scroll reveal
   ========================= */
function initializeScrollEffects() {
  const revealElements = document.querySelectorAll('.reveal-element');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          const index = Array.from(revealElements).indexOf(entry.target);
          const delay = Math.min(index * 0.08, 0.24); // cap delay for faster pop-in
          entry.target.style.transitionDelay = `${delay}s`;
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
}

/* =========================
   Particles
   ========================= */
function initializeParticleSystem() {
  const container = document.getElementById('particles-container');
  if (!container || typeof anime === 'undefined') return;

  for (let i = 0; i < 50; i++) createParticle(container);

  function createParticle(parent) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    parent.appendChild(particle);

    anime({
      targets: particle,
      translateX: [
        { value: Math.random() * 200 - 100, duration: 3000 },
        { value: Math.random() * 200 - 100, duration: 3000 },
      ],
      translateY: [
        { value: Math.random() * 200 - 100, duration: 3000 },
        { value: Math.random() * 200 - 100, duration: 3000 },
      ],
      opacity: [{ value: 0.8, duration: 1500 }, { value: 0.2, duration: 1500 }],
      scale: [{ value: 1.2, duration: 1500 }, { value: 0.8, duration: 1500 }],
      loop: true,
      easing: 'easeInOutSine',
    });
  }
}

/* =========================
   Counters
   ========================= */
function initializeCounters() {
  const counters = document.querySelectorAll('.stats-counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        if (typeof anime !== 'undefined') {
          anime({
            targets: { count: 0 },
            count: target,
            duration: 2000,
            easing: 'easeOutQuad',
            update: function (anim) {
              counter.textContent = Math.floor(anim.animatables[0].target.count).toLocaleString();
            },
          });
        } else {
          counter.textContent = target.toLocaleString();
        }
        counterObserver.unobserve(counter);
      }
    });
  });
  counters.forEach((c) => counterObserver.observe(c));
}

/* =========================
   Progress bars
   ========================= */
function initializeProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = parseInt(bar.getAttribute('data-progress'), 10) || 0;
        if (typeof anime !== 'undefined') {
          anime({ targets: bar, width: progress + '%', duration: 1500, easing: 'easeOutQuad', delay: 500 });
        } else {
          bar.style.width = progress + '%';
        }
        progressObserver.unobserve(bar);
      }
    });
  });
  progressBars.forEach((b) => progressObserver.observe(b));
}

/* =========================
   Smooth anchor links
   ========================= */
function wireSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* =========================
   Nav background on scroll
   ========================= */
function wireNavScrollBG() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-white/95');
      nav.classList.remove('bg-white/90');
    } else {
      nav.classList.add('bg-white/90');
      nav.classList.remove('bg-white/95');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* =========================
   Mobile menu
   ========================= */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
}

/* =========================
   Utilities & Exports
   ========================= */
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add('border-red-500');
      isValid = false;
    } else {
      input.classList.remove('border-red-500');
    }
  });
  return isValid;
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  if (typeof anime !== 'undefined') {
    anime({ targets: notification, translateX: [300, 0], opacity: [0, 1], duration: 300, easing: 'easeOutQuad' });
    setTimeout(() => {
      anime({
        targets: notification,
        translateX: 300,
        opacity: 0,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => notification.remove(),
      });
    }, 3000);
  } else {
    setTimeout(() => notification.remove(), 3000);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

window.GreenCell = { showNotification, validateForm, debounce, throttle, toggleMobileMenu };

/* =========================
   SDG expand/collapse
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('sdg-toggle-btn');
  const expanded = document.getElementById('sdg-expanded');
  if (!btn || !expanded) return;

  const defaultLabel = btn.textContent.trim() || 'Explore All 17 SDGs';
  let open = false;

  const animate = (show) => {
    expanded.style.transition = 'height 250ms ease';
    if (show) {
      expanded.classList.remove('hidden');
      expanded.style.height = '0px';
      requestAnimationFrame(() => {
        expanded.style.height = expanded.scrollHeight + 'px';
      });
    } else {
      expanded.style.height = expanded.scrollHeight + 'px';
      requestAnimationFrame(() => {
        expanded.style.height = '0px';
      });
      expanded.addEventListener(
        'transitionend',
        () => {
          expanded.classList.add('hidden');
          expanded.style.height = '';
        },
        { once: true }
      );
      return;
    }
    expanded.addEventListener(
      'transitionend',
      () => {
        expanded.style.height = '';
      },
      { once: true }
    );
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    open = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      animate(true);
      btn.textContent = 'Show Less';
    } else {
      animate(false);
      btn.textContent = defaultLabel;
      expanded.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================
   Modal controller
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const openModal = (key) => {
    const el = document.getElementById(`modal-${key}`);
    if (!el) { console.warn('[modal] missing modal:', key); return; }
    el.classList.remove('hidden');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstClose = el.querySelector('[data-modal-close]');
    if (firstClose) firstClose.focus();
  };

  const closeModal = (key) => {
    const el = document.getElementById(`modal-${key}`);
    if (!el) { console.warn('[modal] missing modal:', key); return; }
    el.classList.add('hidden');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Open / Close via data attributes
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) {
      e.preventDefault();
      const key = opener.getAttribute('data-modal-open');
      openModal(key);
      return;
    }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) {
      e.preventDefault();
      const key = closer.getAttribute('data-modal-close');
      closeModal(key);
    }
  });

  // ESC to close the topmost open modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = [...document.querySelectorAll('.modal:not(.hidden)')].pop();
    if (!open) return;
    closeModal(open.id.replace(/^modal-/, ''));
  });
});
/* ---------- login handler ---------- */
async function handleLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const { error } = await supabase.auth.signInWithPassword({
    email: fd.get('email').trim(),
    password: fd.get('password').trim()
  });
  if (error) return alert(error.message);
  window.location.href = 'dashboard.html';
}
// wait until the button is in the DOM, then wire it once
document.addEventListener('DOMContentLoaded', () => {
  const joinBtn = document.querySelector('button'); // the only button in nav
  if (joinBtn && joinBtn.textContent.trim() === 'Join Now') {
    joinBtn.onclick = () => (location.href = 'signup.html');
  }
});
