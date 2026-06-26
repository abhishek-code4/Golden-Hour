/* ============================================================
   GOLDEN HOUR — Patient Request Logic
   GPS detection, form handling, ambulance assignment
   ============================================================ */

let requestMap, userMarker, userLat, userLng;
let hospitalMarkers = [];
let ambulanceMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
  const user = App.requireAuth(['patient']);
  if (!user) return;
  App.injectNavbar('request');

  // Pre-fill user name
  document.getElementById('patient-name').value = user.name || '';

  // Init map
  requestMap = MapHelper.initMap('request-map', { zoom: 14 });

  // Populate emergency types
  renderEmergencyTypes();

  // Detect GPS
  detectLocation();

  // Initial load
  refreshHospitalMarkers();
  refreshAmbulanceMarkers();
});

function refreshHospitalMarkers() {
  hospitalMarkers.forEach(m => { if (m.marker) m.marker.remove(); });
  const hospitals = GoldenHourData.getHospitals();
  hospitalMarkers = MapHelper.addHospitalMarkers(requestMap, hospitals);
}

function refreshAmbulanceMarkers() {
  ambulanceMarkers.forEach(m => { if (m.marker) m.marker.remove(); });
  const ambulances = GoldenHourData.getAmbulances().filter(a => a.status === 'available');
  ambulanceMarkers = MapHelper.addAmbulanceMarkers(requestMap, ambulances);
}

function renderEmergencyTypes() {
  const grid = document.getElementById('emergency-type-grid');
  grid.innerHTML = GoldenHourData.EMERGENCY_TYPES.map((type, i) => `
    <div class="emergency-type-option">
      <input type="radio" name="emergency-type" id="etype-${type.id}" value="${type.id}" ${i === 0 ? 'checked' : ''}>
      <label for="etype-${type.id}">
        <span class="type-icon">${type.icon}</span>
        ${type.label}
      </label>
    </div>
  `).join('');
}

function detectLocation() {
  const status = document.getElementById('location-status');
  const addressEl = document.getElementById('location-address');

  if (!navigator.geolocation) {
    status.className = 'location-detect error';
    addressEl.textContent = 'Geolocation not supported. Enter address manually.';
    setFallbackLocation();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;

      status.className = 'location-detect';
      status.querySelector('strong').textContent = 'Location detected ✓';
      addressEl.textContent = `${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;

      updateMapPosition();
    },
    (err) => {
      console.warn('GPS error:', err);
      status.className = 'location-detect error';
      status.querySelector('strong').textContent = 'Location access denied';
      addressEl.textContent = 'Using default location (Delhi). Enter your address below.';
      setFallbackLocation();
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function setFallbackLocation() {
  // Use Delhi center as fallback
  userLat = GoldenHourData.CENTER_LAT + (Math.random() - 0.5) * 0.02;
  userLng = GoldenHourData.CENTER_LNG + (Math.random() - 0.5) * 0.02;
  updateMapPosition();
}

function updateMapPosition() {
  requestMap.setCenter({ lat: userLat, lng: userLng });
  requestMap.setZoom(15);

  // Fetch real hospitals near user location
  MapHelper.loadRealHospitals(requestMap, (realHospitals) => {
    GoldenHourData.registerDynamicHospitals(realHospitals);
    refreshHospitalMarkers();
    refreshAmbulanceMarkers();
  });

  if (userMarker) {
    userMarker.setPosition({ lat: userLat, lng: userLng });
  } else {
    userMarker = MapHelper.createMarker(
      requestMap,
      userLat,
      userLng,
      MapHelper.createPatientIcon(),
      'Your Location',
      '<strong>📍 Your Location</strong><br>Drag to adjust',
      true // draggable
    );

    // Open popup immediately
    userMarker.openPopup();

    // Allow dragging to adjust location
    userMarker.addListener('dragend', () => {
      const pos = userMarker.getPosition();
      userLat = pos.lat();
      userLng = pos.lng();
      document.getElementById('location-address').textContent = `${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
      
      // Load new real hospitals near the dragged location
      requestMap.setCenter({ lat: userLat, lng: userLng });
      MapHelper.loadRealHospitals(requestMap, (realHospitals) => {
        GoldenHourData.registerDynamicHospitals(realHospitals);
        refreshHospitalMarkers();
        refreshAmbulanceMarkers();
      });
    });
  }
}

function submitRequest(e) {
  e.preventDefault();

  if (!userLat || !userLng) {
    App.showToast('error', 'Location Required', 'Please allow GPS access or enter your address.');
    return;
  }

  const emergencyType = document.querySelector('input[name="emergency-type"]:checked')?.value || 'other';

  const requestData = {
    patientName: document.getElementById('patient-name').value,
    patientAge: document.getElementById('patient-age').value,
    phone: GoldenHourData.getCurrentUser()?.phone || '',
    emergencyType: emergencyType,
    numPatients: parseInt(document.getElementById('num-patients').value) || 1,
    medicalCondition: document.getElementById('medical-condition').value,
    hospitalPreference: document.getElementById('hospital-preference').value,
    lat: userLat,
    lng: userLng,
    address: document.getElementById('manual-address').value || `GPS: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`,
  };

  // Create request
  const newRequest = GoldenHourData.createRequest(requestData);

  // Auto-assign nearest ambulance
  const result = GoldenHourData.assignNearestToRequest(newRequest.id);

  if (result) {
    // Add notification
    GoldenHourData.addNotification({
      type: 'success',
      title: 'Ambulance Assigned!',
      message: `${result.ambulance.vehicleNo} (${result.ambulance.type}) is on the way. ETA: ${result.eta} minutes.`,
    });

    // Show success modal
    App.showModal('🚑 Ambulance Dispatched!', `
      <div style="text-align:center;padding:var(--space-md) 0">
        <div style="font-size:4rem;margin-bottom:var(--space-md)">🚑</div>
        <h3 style="margin-bottom:var(--space-sm)">Help is on the way!</h3>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">
          <strong>${result.ambulance.vehicleNo}</strong> (${result.ambulance.type})<br>
          Driver: ${result.ambulance.driver}<br>
          ETA: <strong style="color:var(--emergency-red)">${result.eta} minutes</strong>
        </p>
        <div class="golden-timer" style="justify-content:center;margin-bottom:var(--space-lg)">
          <span>⏱️</span>
          <div>
            <div class="golden-timer-value">60:00</div>
            <div class="golden-timer-label">Golden Hour Countdown</div>
          </div>
        </div>
        <button class="btn btn-emergency" onclick="window.location.href='track.html'" style="width:100%">
          📍 Track Ambulance Live
        </button>
      </div>
    `);

    App.showToast('success', 'SOS Sent!', `Ambulance ${result.ambulance.vehicleNo} dispatched. ETA: ${result.eta} min`);
  } else {
    App.showToast('warning', 'Request Submitted', 'No ambulances available nearby. A dispatcher will assign one shortly.');

    setTimeout(() => {
      window.location.href = 'track.html';
    }, 2000);
  }
}
