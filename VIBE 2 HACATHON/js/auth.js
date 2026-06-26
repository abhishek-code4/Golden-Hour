/* ============================================================
   GOLDEN HOUR — Auth Logic
   Login, Signup, Tab switching
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  App.injectNavbar('');
  App.injectParticles(15);

  // If already logged in, redirect
  const user = GoldenHourData.getCurrentUser();
  if (user) {
    window.location.href = App.getDashboardForRole(user.role);
  }

  // Show medical history for patient role
  document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const medGroup = document.getElementById('medical-history-group');
      medGroup.style.display = radio.value === 'patient' ? 'flex' : 'none';
    });
  });
});

function switchTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'flex' : 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = GoldenHourData.login(email, password);
  if (user) {
    App.showToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
    setTimeout(() => {
      window.location.href = App.getDashboardForRole(user.role);
    }, 800);
  } else {
    App.showToast('error', 'Login Failed', 'Invalid email or password.');
  }
}

function handleSignup(e) {
  e.preventDefault();
  const role = document.querySelector('input[name="role"]:checked').value;
  const userData = {
    name: document.getElementById('signup-name').value,
    phone: document.getElementById('signup-phone').value,
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value,
    role: role,
    medicalHistory: role === 'patient' ? document.getElementById('signup-medical').value : '',
  };

  const user = GoldenHourData.signup(userData);
  if (user) {
    App.showToast('success', 'Account Created!', `Welcome, ${user.name}!`);
    setTimeout(() => {
      window.location.href = App.getDashboardForRole(user.role);
    }, 800);
  } else {
    App.showToast('error', 'Signup Failed', 'An account with this email already exists.');
  }
}
