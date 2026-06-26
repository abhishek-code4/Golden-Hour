/* ============================================================
   GOLDEN HOUR — Patient Live Tracking
   Real-time ambulance movement, ETA countdown, status updates
   ============================================================ */

let trackMap, ambMarker, patientMarker, routeLine;
let trackInterval, etaInterval, goldenInterval;
let simulationProgress = 0;
let currentRequest = null;
let assignedAmbulance = null;
let ambStartLat, ambStartLng;

document.addEventListener('DOMContentLoaded', () => {
  const user = App.requireAuth(['patient']);
  if (!user) return;
  App.injectNavbar('track');

  currentRequest = GoldenHourData.getActiveRequest();

  if (!currentRequest || currentRequest.status === 'completed') {
    showNoRequest();
    return;
  }

  // Get assigned ambulance data
  if (currentRequest.assignedAmbulance) {
    const ambulances = GoldenHourData.getAmbulances();
    assignedAmbulance = ambulances.find(a => a.id === currentRequest.assignedAmbulance);
  }

  renderTrackingView();
});

function showNoRequest() {
  document.getElementById('track-content').innerHTML = `
    <div class="no-request">
      <div class="no-request-icon">🚑</div>
      <h3>No Active Request</h3>
      <p>You don't have an active ambulance request. Tap below to request one if you need emergency help.</p>
      <a href="request.html" class="btn btn-emergency">🆘 Request Ambulance</a>
    </div>
  `;
}

function renderTrackingView() {
  const emergencyInfo = App.getEmergencyInfo(currentRequest.emergencyType);

  document.getElementById('track-content').innerHTML = `
    <div class="track-layout">
      <div class="track-map-side">
        <div id="track-map"></div>
      </div>
      <div class="track-info-side">
        <!-- Status -->
        <div class="track-status-header">
          <div class="track-status-badge status-${currentRequest.status}" id="status-badge">
            <span class="status-dot emergency"></span>
            <span id="status-text">${getStatusText(currentRequest.status)}</span>
          </div>
          <h3>${emergencyInfo.icon} ${emergencyInfo.label}</h3>
        </div>

        <!-- Golden Hour Timer -->
        <div class="golden-timer" id="golden-timer">
          <span>⏱️</span>
          <div>
            <div class="golden-timer-value" id="golden-value">60:00</div>
            <div class="golden-timer-label">Golden Hour Remaining</div>
          </div>
        </div>

        <!-- ETA -->
        <div class="eta-display" id="eta-display" style="margin-top:var(--space-lg)">
          <div class="eta-value" id="eta-value">${currentRequest.eta || '—'}</div>
          <div class="eta-label">Minutes ETA</div>
          <div class="progress-bar" style="margin-top:var(--space-sm)">
            <div class="progress-bar-fill blue" id="eta-progress" style="width:0%"></div>
          </div>
        </div>

        <!-- Driver Details -->
        ${assignedAmbulance ? `
        <div class="driver-card" style="margin-top:var(--space-lg)">
          <div class="driver-avatar">👨‍✈️</div>
          <div class="driver-info">
            <h5>${assignedAmbulance.driver}</h5>
            <p>${assignedAmbulance.vehicleNo} · ${assignedAmbulance.type}</p>
            <p>${assignedAmbulance.driverPhone}</p>
          </div>
          <div class="driver-call">
            <button class="btn btn-icon btn-primary" onclick="callDriver()" title="Call Driver">📞</button>
          </div>
        </div>
        ` : '<p style="color:var(--text-muted);text-align:center;padding:var(--space-lg)">Waiting for ambulance assignment...</p>'}

        <!-- Status Timeline -->
        <h5 style="margin: var(--space-lg) 0 var(--space-md)">Status Timeline</h5>
        <div class="timeline" id="status-timeline">
          ${renderTimeline()}
        </div>

        <!-- Patient Details -->
        <div class="glass-card-static" style="margin-top:var(--space-lg)">
          <h5 style="margin-bottom:var(--space-sm)">Request Details</h5>
          <div style="font-size:0.85rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px">
            <div>👤 ${currentRequest.patientName}${currentRequest.patientAge ? ', ' + currentRequest.patientAge + ' yrs' : ''}</div>
            <div>📍 ${currentRequest.address}</div>
            <div>🏥 ${emergencyInfo.label}</div>
            ${currentRequest.medicalCondition ? `<div>💊 ${currentRequest.medicalCondition}</div>` : ''}
            <div>🕐 Requested: ${App.formatTimestamp(currentRequest.createdAt)}</div>
          </div>
        </div>

        <!-- Emergency Contacts Notice -->
        <div style="text-align:center;padding:var(--space-lg) 0;color:var(--text-muted);font-size:0.8rem">
          📲 Your emergency contacts have been notified via SMS
        </div>
      </div>
    </div>
  `;

  initTrackingMap();
  startSimulation();
  startGoldenHourTimer();
}

function getStatusText(status) {
  const texts = {
    pending: '⏳ Finding Nearest Ambulance...',
    assigned: '✅ Ambulance Assigned',
    'en-route': '🚑 Ambulance En Route',
    arriving: '📍 Ambulance Arriving!',
    reached: '🏁 Ambulance Has Arrived',
    completed: '✅ Trip Completed',
  };
  return texts[status] || status;
}

function renderTimeline() {
  const steps = [
    { key: 'pending', label: 'Request Submitted', icon: '📱' },
    { key: 'assigned', label: 'Ambulance Assigned', icon: '✅' },
    { key: 'en-route', label: 'Ambulance En Route', icon: '🚑' },
    { key: 'arriving', label: 'Arriving at Location', icon: '📍' },
    { key: 'reached', label: 'Ambulance Arrived', icon: '🏁' },
  ];

  const statusOrder = ['pending', 'assigned', 'en-route', 'arriving', 'reached'];
  const currentIdx = statusOrder.indexOf(currentRequest.status);

  return steps.map((step, i) => {
    let cls = '';
    if (i < currentIdx) cls = 'completed';
    else if (i === currentIdx) cls = 'active';

    const historyEntry = currentRequest.statusHistory?.find(h => h.status === step.key);
    const time = historyEntry ? App.formatTimestamp(historyEntry.time) : '';

    return `
      <div class="timeline-item ${cls}">
        <div style="font-size:0.9rem;font-weight:600">${step.icon} ${step.label}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${time}</div>
      </div>
    `;
  }).join('');
}

function initTrackingMap() {
  // Use the same map style as other pages — centered on patient location with consistent zoom
  trackMap = MapHelper.initMap('track-map', {
    center: { lat: currentRequest.lat, lng: currentRequest.lng },
    zoom: 14
  });

  // Patient marker
  patientMarker = MapHelper.createMarker(
    trackMap,
    currentRequest.lat,
    currentRequest.lng,
    MapHelper.createPatientIcon(),
    'Patient Location',
    '<strong>📍 Patient Location</strong>'
  );

  // Ambulance marker
  if (assignedAmbulance) {
    ambStartLat = assignedAmbulance.lat;
    ambStartLng = assignedAmbulance.lng;

    ambMarker = MapHelper.createMarker(
      trackMap,
      ambStartLat,
      ambStartLng,
      MapHelper.createAmbulanceIcon('en-route'),
      assignedAmbulance.vehicleNo,
      `<strong>🚑 ${assignedAmbulance.vehicleNo}</strong><br>${assignedAmbulance.driver}`
    );

    // Draw route
    routeLine = MapHelper.drawRoute(trackMap,
      [ambStartLat, ambStartLng],
      [currentRequest.lat, currentRequest.lng],
      '#1E88E5'
    );

    // Fit bounds
    MapHelper.fitBounds(trackMap, [
      [ambStartLat, ambStartLng],
      [currentRequest.lat, currentRequest.lng],
    ]);
  } else {
    trackMap.setCenter({ lat: currentRequest.lat, lng: currentRequest.lng });
    trackMap.setZoom(15);
  }

  // Add nearby hospitals
  MapHelper.addHospitalMarkers(trackMap, GoldenHourData.getHospitals());
}

function startSimulation() {
  if (!assignedAmbulance) return;

  const totalDuration = (currentRequest.eta || 8) * 60 * 1000; // Convert minutes to ms
  const updateInterval = 2000; // Update every 2 seconds
  const startTime = Date.now();

  // Simulate status transitions
  const statusTransitions = [
    { progress: 0.0, status: 'en-route' },
    { progress: 0.75, status: 'arriving' },
    { progress: 1.0, status: 'reached' },
  ];

  // Update existing request to en-route if still assigned
  if (currentRequest.status === 'assigned') {
    GoldenHourData.updateRequest(currentRequest.id, { status: 'en-route' });
    currentRequest.status = 'en-route';
    App.showToast('info', 'Ambulance En Route', `${assignedAmbulance.vehicleNo} is heading to your location.`);
  }

  trackInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    simulationProgress = Math.min(elapsed / totalDuration, 1);

    // Move ambulance marker
    const newPos = MapHelper.simulateMovement(
      ambStartLat, ambStartLng,
      currentRequest.lat, currentRequest.lng,
      simulationProgress
    );
    if (ambMarker) ambMarker.setPosition({ lat: newPos.lat, lng: newPos.lng });

    // Update ETA
    const remainingMs = totalDuration - elapsed;
    const remainingMin = Math.max(0, Math.ceil(remainingMs / 60000));
    const etaEl = document.getElementById('eta-value');
    const progressEl = document.getElementById('eta-progress');
    if (etaEl) etaEl.textContent = remainingMin;
    if (progressEl) progressEl.style.width = (simulationProgress * 100) + '%';

    // Check status transitions
    for (const transition of statusTransitions) {
      if (simulationProgress >= transition.progress && currentRequest.status !== transition.status && currentRequest.status !== 'reached') {
        currentRequest.status = transition.status;
        GoldenHourData.updateRequest(currentRequest.id, { status: transition.status });

        // Update UI
        const badge = document.getElementById('status-badge');
        const statusText = document.getElementById('status-text');
        if (badge) badge.className = `track-status-badge status-${transition.status}`;
        if (statusText) statusText.textContent = getStatusText(transition.status);

        // Update timeline
        const timeline = document.getElementById('status-timeline');
        if (timeline) timeline.innerHTML = renderTimeline();

        // Show toast
        const toasts = {
          'en-route': { type: 'info', title: 'Ambulance En Route', msg: 'The ambulance is heading to your location.' },
          arriving: { type: 'warning', title: 'Almost There!', msg: 'The ambulance is arriving at your location.' },
          reached: { type: 'success', title: 'Ambulance Arrived!', msg: 'The ambulance has reached your location.' },
        };
        const t = toasts[transition.status];
        if (t) App.showToast(t.type, t.title, t.msg, 5000);
      }
    }

    // Stop simulation when reached
    if (simulationProgress >= 1) {
      clearInterval(trackInterval);
      if (ambMarker) ambMarker.setPosition({ lat: currentRequest.lat, lng: currentRequest.lng });
    }
  }, updateInterval);
}

function startGoldenHourTimer() {
  goldenInterval = setInterval(() => {
    const remaining = App.getGoldenHourRemaining(currentRequest.goldenHourStart || currentRequest.createdAt);
    const goldenEl = document.getElementById('golden-value');
    const timerEl = document.getElementById('golden-timer');

    if (goldenEl) goldenEl.textContent = App.formatGoldenHour(remaining);

    if (timerEl) {
      if (remaining < 10 * 60 * 1000) { // < 10 min
        timerEl.className = 'golden-timer critical';
      } else if (remaining < 30 * 60 * 1000) { // < 30 min
        timerEl.className = 'golden-timer warning';
      }
    }

    if (remaining <= 0) {
      clearInterval(goldenInterval);
    }
  }, 1000);
}

function callDriver() {
  if (assignedAmbulance) {
    App.showToast('info', 'Calling Driver', `Dialing ${assignedAmbulance.driver} at ${assignedAmbulance.driverPhone}`);
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clearInterval(trackInterval);
  clearInterval(etaInterval);
  clearInterval(goldenInterval);
});
