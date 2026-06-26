/* ============================================================
   GOLDEN HOUR — Shared App Utilities
   Auth guard, toast notifications, navigation, helpers
   ============================================================ */

const App = (() => {
  // ── Toast System ──
  function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(type, title, message, duration = 4000) {
    const container = ensureToastContainer();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300)">✕</button>
    `;
    container.appendChild(toast);

    // Play sound effect for emergency
    if (type === 'error' || type === 'warning') {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = type === 'error' ? 800 : 600;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    }

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ── Modal System ──
  function showModal(titleText, contentHTML, actions = []) {
    // Remove existing
    const existing = document.getElementById('app-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'app-modal-backdrop';
    backdrop.className = 'modal-backdrop';

    let actionsHTML = actions.map(a =>
      `<button class="btn ${a.class || 'btn-primary'}" onclick="${a.onclick}">${a.label}</button>`
    ).join('');

    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${titleText}</h3>
          <button class="modal-close" onclick="App.closeModal()">✕</button>
        </div>
        <div class="modal-body">${contentHTML}</div>
        ${actionsHTML ? `<div style="display:flex;gap:0.75rem;margin-top:1.5rem;justify-content:flex-end">${actionsHTML}</div>` : ''}
      </div>
    `;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('active'));
  }

  function closeModal() {
    const backdrop = document.getElementById('app-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      setTimeout(() => backdrop.remove(), 300);
    }
  }

  // ── Auth Guard ──
  function requireAuth(allowedRoles) {
    const user = GoldenHourData.getCurrentUser();
    if (!user) {
      window.location.href = getBasePath() + 'login.html';
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      window.location.href = getBasePath() + getDashboardForRole(user.role);
      return null;
    }
    return user;
  }

  function getDashboardForRole(role) {
    const routes = {
      patient: 'patient/request.html',
      dispatcher: 'dispatcher/dashboard.html',
      hospital: 'hospital/dashboard.html',
      admin: 'admin/dashboard.html',
    };
    return routes[role] || 'index.html';
  }

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/patient/') || path.includes('/dispatcher/') || path.includes('/hospital/') || path.includes('/admin/')) {
      return '../';
    }
    return './';
  }

  // ── Navigation ──
  function injectNavbar(activeLink) {
    const user = GoldenHourData.getCurrentUser();
    const base = getBasePath();

    let navLinks = '';
    if (user) {
      switch (user.role) {
        case 'patient':
          navLinks = `
            <a href="${base}patient/request.html" class="navbar-link ${activeLink === 'request' ? 'active' : ''}">🚨 Request</a>
            <a href="${base}patient/track.html" class="navbar-link ${activeLink === 'track' ? 'active' : ''}">📍 Track</a>
          `;
          break;
        case 'dispatcher':
          navLinks = `<a href="${base}dispatcher/dashboard.html" class="navbar-link ${activeLink === 'dispatch' ? 'active' : ''}">📡 Dispatch Center</a>`;
          break;
        case 'hospital':
          navLinks = `<a href="${base}hospital/dashboard.html" class="navbar-link ${activeLink === 'hospital' ? 'active' : ''}">🏥 Dashboard</a>`;
          break;
        case 'admin':
          navLinks = `<a href="${base}admin/dashboard.html" class="navbar-link ${activeLink === 'admin' ? 'active' : ''}">⚙️ Admin</a>`;
          break;
      }
      navLinks += `
        <span class="navbar-link" style="color:var(--text-muted);font-size:0.85rem">👤 ${user.name}</span>
        <a href="#" class="navbar-link" onclick="App.handleLogout(event)" style="color:var(--emergency-red)">Logout</a>
      `;
    } else {
      navLinks = `
        <a href="${base}index.html" class="navbar-link ${activeLink === 'home' ? 'active' : ''}">Home</a>
        <a href="${base}index.html#features" class="navbar-link">Features</a>
        <a href="${base}index.html#how-it-works" class="navbar-link">How It Works</a>
        <a href="${base}login.html" class="btn btn-primary btn-sm">Login / Sign Up</a>
      `;
    }

    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'main-navbar';
    nav.innerHTML = `
      <a href="${base}index.html" class="navbar-brand">
        <span class="logo-icon">🚑</span>
        <span>Golden<span style="color:var(--emergency-red)">Hour</span></span>
      </a>
      <button class="navbar-hamburger" onclick="document.getElementById('nav-links').classList.toggle('open')" aria-label="Toggle navigation">☰</button>
      <div class="navbar-nav" id="nav-links">
        ${navLinks}
      </div>
    `;

    document.body.prepend(nav);
  }

  function handleLogout(e) {
    e.preventDefault();
    GoldenHourData.logout();
    window.location.href = getBasePath() + 'index.html';
  }

  // ── Particles Background ──
  function injectParticles(count = 30) {
    const container = document.createElement('div');
    container.className = 'particles-bg';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (15 + Math.random() * 20) + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  // ── Scroll Reveal ──
  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Helpers ──
  function formatTime(minutes) {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`;
  }

  function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  function formatTimestamp(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function formatTimeAgo(ts) {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
  }

  function getGoldenHourRemaining(startTime) {
    const elapsed = Date.now() - startTime;
    const remaining = 60 * 60 * 1000 - elapsed; // 60 minutes
    return Math.max(0, remaining);
  }

  function formatGoldenHour(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  function getEmergencyInfo(typeId) {
    return GoldenHourData.EMERGENCY_TYPES.find(e => e.id === typeId) || GoldenHourData.EMERGENCY_TYPES[GoldenHourData.EMERGENCY_TYPES.length - 1];
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ── Language Toggle (EN / HI) ──
  let currentLang = localStorage.getItem('gh_lang') || 'en';

  const translations = {
    en: {
      heroTitle: 'Reach Help Faster in the Golden Hour',
      heroSubtitle: 'One-tap SOS → Nearest ambulance → Live tracking → Hospital ready when you arrive.',
      requestBtn: 'Request Ambulance Now',
      howItWorks: 'How It Works',
      whyGoldenHour: 'Why Golden Hour Matters',
      forPatients: 'For Patients',
      forHospitals: 'For Hospitals',
      forOperators: 'For Ambulance Operators',
    },
    hi: {
      heroTitle: 'गोल्डन ऑवर में तेज़ी से मदद पाएं',
      heroSubtitle: 'एक टैप SOS → नज़दीकी एम्बुलेंस → लाइव ट्रैकिंग → अस्पताल आपके पहुंचने से पहले तैयार।',
      requestBtn: 'अभी एम्बुलेंस बुक करें',
      howItWorks: 'कैसे काम करता है',
      whyGoldenHour: 'गोल्डन ऑवर क्यों ज़रूरी है',
      forPatients: 'मरीज़ों के लिए',
      forHospitals: 'अस्पतालों के लिए',
      forOperators: 'एम्बुलेंस ऑपरेटरों के लिए',
    },
  };

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('gh_lang', lang);
  }

  function getLang() {
    return currentLang;
  }

  // ── Public API ──
  return {
    showToast, showModal, closeModal,
    requireAuth, getDashboardForRole, getBasePath,
    injectNavbar, handleLogout,
    injectParticles, initRevealAnimations,
    formatTime, formatDistance, formatTimestamp, formatTimeAgo,
    getGoldenHourRemaining, formatGoldenHour, getEmergencyInfo,
    debounce,
    t, setLang, getLang,
  };
})();
