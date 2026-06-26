/* ============================================================
   GOLDEN HOUR — Dispatcher Dashboard Logic
   Map view, request management, ambulance assignment
   ============================================================ */

let dispatchMap;
let ambMarkers = [];
let requestMarkers = [];
let currentTab = 'requests';

document.addEventListener('DOMContentLoaded', () => {
  const user = App.requireAuth(['dispatcher']);
  if (!user) return;
  App.injectNavbar('dispatch');

  initDispatchMap();
  renderStats();
  renderRequests();

  // Auto-refresh every 5 seconds
  setInterval(() => {
    renderStats();
    if (currentTab === 'requests') renderRequests();
    else if (currentTab === 'fleet') renderFleet();
    // hospitals tab doesn't need auto-refresh
    updateMapMarkers();
  }, 5000);

  // Seed a demo request if none exist
  seedDemoRequest();
});

function seedDemoRequest() {
  const requests = GoldenHourData.getRequests();
  if (requests.length === 0) {
    // Create some demo requests
    const demoRequests = [
      { patientName: 'Anita Desai', patientAge: '45', phone: '+91 98765 11111', emergencyType: 'heart_attack', numPatients: 1, medicalCondition: 'Hypertension, Diabetes', lat: 28.6280, lng: 77.2190, address: 'Near Connaught Place, Delhi' },
      { patientName: 'Ravi Kapoor', patientAge: '32', phone: '+91 98765 22222', emergencyType: 'accident', numPatients: 2, medicalCondition: '', lat: 28.6150, lng: 77.2350, address: 'Pragati Maidan, Delhi' },
      { patientName: 'Meera Jain', patientAge: '28', phone: '+91 98765 33333', emergencyType: 'pregnancy', numPatients: 1, medicalCondition: 'First pregnancy, 38 weeks', lat: 28.6050, lng: 77.2050, address: 'Lodhi Road, Delhi' },
    ];

    demoRequests.forEach(r => GoldenHourData.createRequest(r));
  }
}

function initDispatchMap() {
  // Use the same center as patient pages (Delhi NCR) with a usable zoom level
  dispatchMap = MapHelper.initMap('dispatch-map', { center: { lat: 28.6139, lng: 77.2090 }, zoom: 12 });
  MapHelper.addHospitalMarkers(dispatchMap, GoldenHourData.getHospitals());
  updateMapMarkers();

  // Dynamically load real hospitals from Google Places as the dispatcher pans/zooms!
  dispatchMap.addListener('idle', () => {
    MapHelper.loadRealHospitals(dispatchMap, (realHospitals) => {
      GoldenHourData.registerDynamicHospitals(realHospitals);
      MapHelper.addHospitalMarkers(dispatchMap, GoldenHourData.getHospitals());
      updateMapMarkers();
    });
  });
}

function updateMapMarkers() {
  // Clear existing
  ambMarkers.forEach(m => { if (m.marker) m.marker.remove(); });
  requestMarkers.forEach(m => { if (m.marker) m.marker.remove(); });
  ambMarkers = [];
  requestMarkers = [];

  // Add ambulances
  const ambulances = GoldenHourData.getAmbulances();
  ambMarkers = MapHelper.addAmbulanceMarkers(dispatchMap, ambulances, (amb) => {
    App.showToast('info', amb.vehicleNo, `${amb.type} · ${amb.driver} · ${amb.status}`);
  });

  // Add request markers
  const requests = GoldenHourData.getRequests().filter(r => r.status !== 'completed');
  requests.forEach(req => {
    const icon = MapHelper.createPatientIcon();
    const emergency = App.getEmergencyInfo(req.emergencyType);
    const popupHTML = `
      <div style="font-family:'Inter',sans-serif;min-width:180px;">
        <div style="font-weight:700;font-size:13px;margin-bottom:4px;">🆘 ${req.patientName}</div>
        <div style="font-size:12px;color:#999;margin-bottom:4px;">${emergency.icon} ${emergency.label}</div>
        <div style="font-size:11px;">📍 ${req.address}</div>
        <div style="font-size:11px;">🕐 ${App.formatTimeAgo(req.createdAt)}</div>
      </div>
    `;
    const marker = MapHelper.createMarker(dispatchMap, req.lat, req.lng, icon, req.patientName, popupHTML);
    requestMarkers.push({ id: req.id, marker });
  });
}

function renderStats() {
  const ambulances = GoldenHourData.getAmbulances();
  const requests = GoldenHourData.getRequests();
  const pending = requests.filter(r => r.status === 'pending').length;
  const active = requests.filter(r => !['completed', 'pending'].includes(r.status)).length;
  const available = ambulances.filter(a => a.status === 'available').length;

  document.getElementById('dispatch-stats').innerHTML = `
    <div class="dispatch-stat">
      <div class="dispatch-stat-value" style="color:var(--emergency-red)">${pending}</div>
      <div class="dispatch-stat-label">Pending</div>
    </div>
    <div class="dispatch-stat">
      <div class="dispatch-stat-value" style="color:var(--warning-amber)">${active}</div>
      <div class="dispatch-stat-label">Active</div>
    </div>
    <div class="dispatch-stat">
      <div class="dispatch-stat-value" style="color:var(--success-green)">${available}</div>
      <div class="dispatch-stat-label">Available</div>
    </div>
    <div class="dispatch-stat">
      <div class="dispatch-stat-value" style="color:var(--medical-blue)">${ambulances.length}</div>
      <div class="dispatch-stat-label">Total Fleet</div>
    </div>
  `;

  document.getElementById('request-count').textContent = pending + active;
}

function switchDispatchTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.dispatch-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  if (tab === 'requests') renderRequests();
  else if (tab === 'fleet') renderFleet();
  else if (tab === 'hospitals') renderHospitals();
}

function renderRequests() {
  const requests = GoldenHourData.getRequests().filter(r => r.status !== 'completed');
  const content = document.getElementById('dispatch-content');

  if (requests.length === 0) {
    content.innerHTML = `
      <div style="text-align:center;padding:var(--space-3xl) var(--space-lg);color:var(--text-muted)">
        <div style="font-size:3rem;margin-bottom:var(--space-md)">✅</div>
        <h4>No Pending Requests</h4>
        <p style="font-size:0.85rem;margin-top:var(--space-sm)">All requests have been handled. System is monitoring for new emergencies.</p>
      </div>
    `;
    return;
  }

  // Sort: pending first, then by time
  requests.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return b.createdAt - a.createdAt;
  });

  content.innerHTML = requests.map(req => {
    const emergency = App.getEmergencyInfo(req.emergencyType);
    const timeAgo = App.formatTimeAgo(req.createdAt);
    const isPending = req.status === 'pending';
    const ambulances = GoldenHourData.getAmbulances();
    const assigned = req.assignedAmbulance ? ambulances.find(a => a.id === req.assignedAmbulance) : null;

    // Find nearest available according to preference — ambulance dispatches from nearest hospital
    let nearest = null;
    let dispatchDistance = null;
    if (isPending) {
      const pref = req.hospitalPreference || 'Government';
      const nearestHosp = GoldenHourData.getNearestHospital(req.lat, req.lng, pref);
      if (nearestHosp) {
        const availableAmbulances = GoldenHourData.getAmbulances().filter(
          a => a.status === 'available' && a.hospitalId === nearestHosp.id
        );
        if (availableAmbulances.length > 0) {
          nearest = availableAmbulances.map(a => ({
            ...a,
            distance: GoldenHourData.haversineDistance(req.lat, req.lng, nearestHosp.lat, nearestHosp.lng),
          })).sort((a, b) => a.distance - b.distance)[0];
          // Distance is from hospital (dispatch point) to patient
          dispatchDistance = GoldenHourData.haversineDistance(req.lat, req.lng, nearestHosp.lat, nearestHosp.lng);
        }
      }
      if (!nearest) {
        // Fallback: absolute nearest available ambulance
        nearest = GoldenHourData.getNearestAmbulance(req.lat, req.lng, emergency.suggestedType);
        if (nearest) dispatchDistance = nearest.distance;
      }
    }
    const nearestDist = dispatchDistance;

    return `
      <div class="request-card ${isPending ? 'urgent' : ''}" onclick="focusRequest('${req.id}')">
        <div class="request-card-header">
          <h5>${emergency.icon} ${req.patientName}</h5>
          <span class="request-card-time">${timeAgo}</span>
        </div>
        <div class="request-card-body">
          <div>${emergency.label} · ${req.numPatients} patient(s)</div>
          <div>🏛️ Pref: <strong style="color: ${req.hospitalPreference === 'Government' ? '#4CAF50' : '#2196F3'}">${req.hospitalPreference || 'Government'} Hospital</strong></div>
          <div>📍 ${req.address}</div>
          ${req.medicalCondition ? `<div>💊 ${req.medicalCondition}</div>` : ''}
          <div>
            <span class="badge badge-${isPending ? 'red' : req.status === 'en-route' ? 'amber' : 'blue'}">${req.status.toUpperCase()}</span>
            ${assigned ? `<span class="badge badge-blue" style="margin-left:4px">🚑 ${assigned.vehicleNo}</span>` : ''}
          </div>
        </div>
        ${isPending ? `
          <div class="request-card-actions">
            ${nearest ? `
              <button class="btn btn-sm btn-emergency" onclick="event.stopPropagation(); assignAmbulance('${req.id}', '${nearest.id}')">
                Assign ${nearest.vehicleNo} (${App.formatDistance(nearestDist)})
              </button>
            ` : '<span style="font-size:0.8rem;color:var(--text-muted)">No ambulances available</span>'}
            <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showAssignModal('${req.id}')">Choose</button>
          </div>
        ` : `
          <div class="request-card-actions">
            ${req.eta ? `<span style="font-size:0.8rem;color:var(--text-secondary)">ETA: ${req.eta} min</span>` : ''}
            <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); completeRequest('${req.id}')" style="margin-left:auto">✓ Complete</button>
          </div>
        `}
      </div>
    `;
  }).join('');
}

function renderFleet() {
  const ambulances = GoldenHourData.getAmbulances();
  const content = document.getElementById('dispatch-content');

  content.innerHTML = ambulances.map(amb => `
    <div class="amb-list-item">
      <div class="amb-icon-wrapper ${amb.status}">🚑</div>
      <div class="amb-info">
        <h5>${amb.vehicleNo} <span class="badge badge-${amb.type === 'ALS' ? 'red' : 'blue'}" style="font-size:0.65rem">${amb.type}</span></h5>
        <p>👨‍✈️ ${amb.driver} · 📞 ${amb.driverPhone}</p>
      </div>
      <div>
        <span class="badge badge-${amb.status === 'available' ? 'green' : amb.status === 'en-route' ? 'amber' : amb.status === 'offline' ? 'purple' : 'red'}">
          ${amb.status}
        </span>
      </div>
    </div>
  `).join('');
}

function focusRequest(requestId) {
  const req = GoldenHourData.getRequests().find(r => r.id === requestId);
  if (req) {
    dispatchMap.setCenter({ lat: req.lat, lng: req.lng });
    dispatchMap.setZoom(16);
    const marker = requestMarkers.find(m => m.id === requestId);
    if (marker && marker.marker) {
      // In Google Maps, infoWindow.open(map, marker) is how you show info windows
      // but in our map.js createMarker, we saved the infoWindow as marker._infoWindow
      if (marker.marker._infoWindow) {
        marker.marker._infoWindow.open(dispatchMap, marker.marker);
      }
    }
  }
}

function assignAmbulance(requestId, ambulanceId) {
  const ambulances = GoldenHourData.getAmbulances();
  const amb = ambulances.find(a => a.id === ambulanceId);
  const req = GoldenHourData.getRequests().find(r => r.id === requestId);

  if (!amb || !req) return;

  // Always find the nearest hospital to the PATIENT's location (not ambulance)
  const pref = req.hospitalPreference || 'Government';
  const hospital = GoldenHourData.getNearestHospital(req.lat, req.lng, pref) || GoldenHourData.getNearestHospital(req.lat, req.lng);
  
  // Ambulance starts from the nearest hospital location (dispatched from hospital)
  const startLat = hospital ? hospital.lat : amb.lat;
  const startLng = hospital ? hospital.lng : amb.lng;

  const distance = GoldenHourData.haversineDistance(req.lat, req.lng, startLat, startLng);
  const eta = Math.max(3, Math.round((distance / 35) * 60));

  GoldenHourData.updateRequest(requestId, {
    status: 'assigned',
    assignedAmbulance: ambulanceId,
    assignedHospital: hospital ? hospital.id : null,
    eta: eta,
  });

  GoldenHourData.updateAmbulance(ambulanceId, {
    status: 'en-route',
    lat: startLat,
    lng: startLng
  });

  App.showToast('success', 'Ambulance Assigned!', `${amb.vehicleNo} dispatched from ${hospital ? hospital.name : 'station'} to ${req.patientName}. ETA: ${eta} min`);

  renderStats();
  renderRequests();
  updateMapMarkers();
}

function showAssignModal(requestId) {
  const ambulances = GoldenHourData.getAmbulances().filter(a => a.status === 'available');
  const req = GoldenHourData.getRequests().find(r => r.id === requestId);

  if (ambulances.length === 0) {
    App.showToast('warning', 'No Ambulances', 'No ambulances are currently available.');
    return;
  }

  const sorted = ambulances.map(a => ({
    ...a,
    distance: GoldenHourData.haversineDistance(req.lat, req.lng, a.lat, a.lng),
  })).sort((a, b) => a.distance - b.distance);

  const listHTML = sorted.map(a => `
    <div class="amb-list-item" style="cursor:pointer" onclick="App.closeModal(); assignAmbulance('${requestId}', '${a.id}')">
      <div class="amb-icon-wrapper available">🚑</div>
      <div class="amb-info">
        <h5>${a.vehicleNo} <span class="badge badge-${a.type === 'ALS' ? 'red' : 'blue'}" style="font-size:0.65rem">${a.type}</span></h5>
        <p>👨‍✈️ ${a.driver} · ${App.formatDistance(a.distance)} away</p>
      </div>
    </div>
  `).join('');

  App.showModal('Choose Ambulance', `
    <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:var(--space-md)">Select an ambulance to assign to <strong>${req.patientName}</strong>:</p>
    ${listHTML}
  `);
}

function completeRequest(requestId) {
  const req = GoldenHourData.getRequests().find(r => r.id === requestId);
  if (!req) return;

  GoldenHourData.updateRequest(requestId, { status: 'completed' });

  if (req.assignedAmbulance) {
    GoldenHourData.updateAmbulance(req.assignedAmbulance, { status: 'available' });
  }

  App.showToast('success', 'Trip Completed', `${req.patientName}'s trip has been marked complete.`);
  renderStats();
  renderRequests();
  updateMapMarkers();
}

function refreshData() {
  renderStats();
  if (currentTab === 'requests') renderRequests();
  else if (currentTab === 'fleet') renderFleet();
  else if (currentTab === 'hospitals') renderHospitals();
  updateMapMarkers();
  App.showToast('info', 'Refreshed', 'Dashboard data updated.');
}

/* ── Hospitals Tab ── */
let hospitalSearchQuery = '';
let hospitalTypeFilter = 'All';

function renderHospitals() {
  const content = document.getElementById('dispatch-content');
  const allHospitals = GoldenHourData.getHospitals();

  // Filter
  let filtered = allHospitals;
  if (hospitalTypeFilter !== 'All') {
    filtered = filtered.filter(h => h.type === hospitalTypeFilter);
  }
  if (hospitalSearchQuery) {
    const q = hospitalSearchQuery.toLowerCase();
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.specialties && h.specialties.some(s => s.toLowerCase().includes(q)))
    );
  }

  const countGov = allHospitals.filter(h => h.type === 'Government').length;
  const countPvt = allHospitals.filter(h => h.type === 'Private').length;

  content.innerHTML = `
    <div style="padding:var(--space-sm);display:flex;flex-direction:column;gap:var(--space-sm);height:100%;">
      <!-- Stats row -->
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;">
        <div style="flex:1;min-width:80px;background:rgba(46,125,50,0.15);border:1px solid rgba(46,125,50,0.3);border-radius:var(--radius-md);padding:8px 12px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:800;color:#4CAF50;">${countGov}</div>
          <div style="font-size:0.7rem;color:#81C784;text-transform:uppercase;letter-spacing:0.5px;">Government</div>
        </div>
        <div style="flex:1;min-width:80px;background:rgba(30,136,229,0.15);border:1px solid rgba(30,136,229,0.3);border-radius:var(--radius-md);padding:8px 12px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:800;color:#1E88E5;">${countPvt}</div>
          <div style="font-size:0.7rem;color:#64b5f6;text-transform:uppercase;letter-spacing:0.5px;">Private</div>
        </div>
        <div style="flex:1;min-width:80px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius-md);padding:8px 12px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:800;color:var(--text-primary);">${allHospitals.length}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Total</div>
        </div>
      </div>

      <!-- Search and filter -->
      <div style="display:flex;gap:var(--space-xs);">
        <input type="text" id="hospital-search" placeholder="Search name or specialty..."
          value="${hospitalSearchQuery}"
          oninput="hospitalSearchQuery=this.value; renderHospitals();"
          style="flex:1;padding:8px 12px;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--text-primary);font-size:0.85rem;outline:none;"
        />
        <select id="hospital-type-filter"
          onchange="hospitalTypeFilter=this.value; renderHospitals();"
          style="padding:8px 10px;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.08);color:var(--text-primary);font-size:0.82rem;outline:none;cursor:pointer;">
          <option value="All" ${hospitalTypeFilter === 'All' ? 'selected' : ''}>All Types</option>
          <option value="Government" ${hospitalTypeFilter === 'Government' ? 'selected' : ''}>🏛️ Government</option>
          <option value="Private" ${hospitalTypeFilter === 'Private' ? 'selected' : ''}>🏥 Private</option>
        </select>
      </div>

      <div style="font-size:0.75rem;color:var(--text-muted);">
        Showing <strong style="color:var(--text-primary);">${filtered.length}</strong> of ${allHospitals.length} hospitals
      </div>

      <!-- Hospital list -->
      <div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px;">
        ${filtered.length === 0 ? `
          <div style="text-align:center;padding:var(--space-xl);color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:var(--space-sm);">🔍</div>
            <p>No hospitals match your search.</p>
          </div>
        ` : filtered.map(h => {
          const typeColor = h.type === 'Government' ? '#4CAF50' : '#1E88E5';
          const typeBg = h.type === 'Government' ? 'rgba(46,125,50,0.15)' : 'rgba(30,136,229,0.15)';
          const typeBorder = h.type === 'Government' ? 'rgba(46,125,50,0.3)' : 'rgba(30,136,229,0.3)';
          return `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:10px 12px;transition:all 0.2s;cursor:pointer;"
              onmouseenter="this.style.background='rgba(255,255,255,0.07)';this.style.borderColor='rgba(255,255,255,0.15)';"
              onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(255,255,255,0.06)';">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:0.85rem;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${h.name}">${h.name}</div>
                  <div style="display:flex;align-items:center;gap:6px;margin-top:4px;flex-wrap:wrap;">
                    <span style="background:${typeBg};color:${typeColor};border:1px solid ${typeBorder};padding:1px 6px;border-radius:4px;font-size:0.65rem;font-weight:700;">${h.type.toUpperCase()}</span>
                    <span style="font-size:0.72rem;color:var(--text-muted);">🛏️ ${h.beds} beds · 🏨 ${h.icuBeds} ICU</span>
                  </div>
                  ${h.specialties ? `<div style="font-size:0.7rem;color:var(--text-secondary);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${h.specialties.join(', ')}">${h.specialties.join(' · ')}</div>` : ''}
                </div>
                <button onclick="event.stopPropagation(); locateHospitalOnMap('${h.id}');"
                  style="flex-shrink:0;padding:4px 10px;border-radius:var(--radius-sm);border:1px solid rgba(30,136,229,0.4);background:rgba(30,136,229,0.1);color:#64b5f6;font-size:0.72rem;cursor:pointer;white-space:nowrap;transition:all 0.2s;"
                  onmouseenter="this.style.background='rgba(30,136,229,0.25)';" onmouseleave="this.style.background='rgba(30,136,229,0.1)';">
                  📍 Locate
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function locateHospitalOnMap(hospitalId) {
  const hospitals = GoldenHourData.getHospitals();
  const h = hospitals.find(hosp => hosp.id === hospitalId);
  if (!h) return;

  dispatchMap.setCenter({ lat: h.lat, lng: h.lng });
  dispatchMap.setZoom(14);

  // Try to open the hospital's popup/marker on the map
  if (window._hospitalMarkers) {
    const hm = window._hospitalMarkers.find(m => m.hospitalId === hospitalId);
    if (hm && hm.marker && hm.marker._infoWindow) {
      hm.marker._infoWindow.open(dispatchMap, hm.marker);
    }
  }

  App.showToast('info', '📍 Hospital Located', `Map centered on ${h.name}`);
}
