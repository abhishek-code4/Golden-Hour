/* ============================================================
   GOLDEN HOUR — Home Page Logic
   Animated counters, feature tabs, quick login, interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  App.injectNavbar('home');
  App.injectParticles(25);
  App.initRevealAnimations();
  initCounters();
  showFeatureTab('patients');
});

// ── Hero SOS Button ──
function handleHeroSOS() {
  const user = GoldenHourData.getCurrentUser();
  if (user && user.role === 'patient') {
    window.location.href = 'patient/request.html';
  } else if (user) {
    window.location.href = App.getDashboardForRole(user.role);
  } else {
    window.location.href = 'login.html';
  }
}

// ── Animated Counters ──
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + (target > 100 ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── Feature Tabs ──
const featureData = {
  patients: [
    { icon: '🆘', title: 'One-Tap Emergency', desc: 'Press a single button to request an ambulance. GPS auto-detects your location for instant dispatch.' },
    { icon: '📍', title: 'Live GPS Tracking', desc: 'Watch the ambulance approach in real-time on a live map with ETA countdown and driver details.' },
    { icon: '🔔', title: 'Status Notifications', desc: 'Get real-time updates: Assigned → En Route → Arriving. Never wonder when help is coming.' },
    { icon: '📋', title: 'Medical History', desc: 'Save your medical history, allergies, and emergency contacts for faster treatment upon arrival.' },
    { icon: '📞', title: 'Emergency Contacts', desc: 'Your family and emergency contacts are automatically notified via SMS when you book an ambulance.' },
    { icon: '🏠', title: 'Saved Locations', desc: 'Save frequent locations like Home, Office, School for even faster booking in emergencies.' },
  ],
  hospitals: [
    { icon: '📊', title: 'Incoming Patient Dashboard', desc: 'See all incoming patients with their emergency type, vitals, ETA, and ambulance location.' },
    { icon: '⏱️', title: 'Golden Hour Timer', desc: 'Monitor how much golden hour time remains for each patient to prioritize critical cases.' },
    { icon: '👨‍⚕️', title: 'Assign Medical Team', desc: 'Pre-assign doctors, nurses, and specialists before the patient arrives at the hospital.' },
    { icon: '🛏️', title: 'Prepare ICU/ER', desc: 'Ready ICU beds, equipment, blood, and oxygen based on the incoming emergency type.' },
    { icon: '📝', title: 'Auto Preparation Checklist', desc: 'Get AI-suggested checklists based on emergency type — trauma kit, cardiac setup, etc.' },
    { icon: '📡', title: 'Real-Time Communication', desc: 'Stay connected with the ambulance paramedic during transit for better pre-arrival coordination.' },
  ],
  operators: [
    { icon: '🚑', title: 'Fleet Management', desc: 'Manage your entire ambulance fleet — add, update, set online/offline status, track maintenance.' },
    { icon: '📊', title: 'Performance Analytics', desc: 'Track average response times, total trips, peak hours, and driver performance metrics.' },
    { icon: '🗺️', title: 'Route History', desc: 'View complete route history of every trip for analysis and optimization of response times.' },
    { icon: '🔧', title: 'Maintenance Tracking', desc: 'Schedule and track maintenance for each ambulance. Get alerts for overdue service.' },
    { icon: '👨‍✈️', title: 'Driver Management', desc: 'Monitor driver assignments, shifts, and performance. Ensure all drivers are certified.' },
    { icon: '📈', title: 'Demand Prediction', desc: 'AI-powered insights on peak demand zones and times to optimize ambulance positioning.' },
  ],
};

function showFeatureTab(tab, btnEl) {
  // Update tabs
  document.querySelectorAll('.feature-tab').forEach(t => t.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  else document.querySelector(`.feature-tab[onclick*="${tab}"]`)?.classList.add('active');

  // Render features
  const container = document.getElementById('features-content');
  const features = featureData[tab] || [];

  container.innerHTML = `<div class="grid grid-3">${features.map(f => `
    <div class="glass-card feature-card" style="animation: fadeInUp 0.5s ease both;">
      <div class="feature-card-icon">${f.icon}</div>
      <h4 class="feature-card-title">${f.title}</h4>
      <p class="feature-card-desc">${f.desc}</p>
    </div>
  `).join('')}</div>`;
}

