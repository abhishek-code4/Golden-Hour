/* ============================================================
   GOLDEN HOUR — Hospital Dashboard Logic
   Incoming patients, golden hour timer, preparation checklists
   ============================================================ */

let miniMaps = {};
let hospitalRefreshInterval;

document.addEventListener('DOMContentLoaded', () => {
  const user = App.requireAuth(['hospital']);
  if (!user) return;
  App.injectNavbar('hospital');

  // Seed demo requests if empty
  seedHospitalDemo();

  renderHospitalStats();
  renderIncomingPatients();

  // Auto-refresh
  hospitalRefreshInterval = setInterval(() => {
    renderHospitalStats();
    renderIncomingPatients();
  }, 5000);
});

function seedHospitalDemo() {
  const requests = GoldenHourData.getRequests();
  if (requests.filter(r => r.status !== 'completed').length === 0) {
    const demos = [
      { patientName: 'Anita Desai', patientAge: '45', emergencyType: 'heart_attack', medicalCondition: 'Hypertension, Diabetes', lat: 28.6280, lng: 77.2190, address: 'Near Connaught Place' },
      { patientName: 'Ravi Kapoor', patientAge: '32', emergencyType: 'accident', numPatients: 2, lat: 28.6150, lng: 77.2350, address: 'Pragati Maidan' },
    ];
    demos.forEach(d => {
      const req = GoldenHourData.createRequest(d);
      GoldenHourData.assignNearestToRequest(req.id);
    });
  }
}

// ── Preparation checklists by emergency type ──
const PREP_CHECKLISTS = {
  heart_attack: ['Ready cardiac monitor', 'Prepare defibrillator', 'Alert cardiology team', 'Prepare IV line & meds', 'Ready ICU bed', 'Prepare oxygen supply'],
  accident: ['Ready trauma kit', 'Prepare X-ray/CT', 'Alert surgery team', 'Ready blood bank', 'Prepare ICU bed', 'Ready splints & bandages'],
  stroke: ['Ready CT scanner', 'Alert neurology team', 'Prepare thrombolytic therapy', 'Ready ICU bed', 'Prepare IV line'],
  pregnancy: ['Alert OB/GYN team', 'Prepare delivery room', 'Ready neonatal unit', 'Prepare blood bank', 'Ready anesthesia team'],
  breathing: ['Prepare ventilator', 'Ready oxygen supply', 'Alert pulmonology', 'Prepare nebulizer', 'Ready ICU bed'],
  burn: ['Prepare burn dressings', 'Ready IV fluids', 'Alert plastic surgery', 'Prepare ICU bed', 'Ready pain management'],
  bleeding: ['Ready blood bank', 'Prepare surgery room', 'Alert vascular surgery', 'Prepare IV line', 'Ready ICU bed'],
  unconscious: ['Prepare CT/MRI', 'Alert neurology', 'Ready ventilator', 'Prepare ICU bed', 'Ready IV line'],
  fall: ['Ready X-ray', 'Alert orthopedics', 'Prepare splints', 'Ready pain management', 'Prepare bed'],
  other: ['Prepare ER bay', 'Ready basic supplies', 'Alert on-call doctor', 'Prepare IV line', 'Ready bed'],
};

function renderHospitalStats() {
  const requests = GoldenHourData.getRequests();
  const active = requests.filter(r => !['completed', 'pending'].includes(r.status));
  const critical = active.filter(r => {
    const info = App.getEmergencyInfo(r.emergencyType);
    return info.priority === 'critical';
  });

  document.getElementById('hospital-stats').innerHTML = `
    <div class="hospital-stat-card">
      <div class="stat-value" style="color:var(--emergency-red)">${active.length}</div>
      <div class="stat-label">Incoming Patients</div>
    </div>
    <div class="hospital-stat-card">
      <div class="stat-value" style="color:var(--warning-amber)">${critical.length}</div>
      <div class="stat-label">Critical Cases</div>
    </div>
    <div class="hospital-stat-card">
      <div class="stat-value" style="color:var(--success-green)">15</div>
      <div class="stat-label">ICU Beds Available</div>
    </div>
    <div class="hospital-stat-card">
      <div class="stat-value" style="color:var(--medical-blue)">8</div>
      <div class="stat-label">Doctors On-Call</div>
    </div>
  `;
}

function renderIncomingPatients() {
  const requests = GoldenHourData.getRequests().filter(r => !['completed', 'pending'].includes(r.status));
  const container = document.getElementById('incoming-patients');

  if (requests.length === 0) {
    container.innerHTML = `
      <div class="hospital-empty">
        <div class="hospital-empty-icon">✅</div>
        <h3>No Incoming Patients</h3>
        <p style="margin-top:var(--space-sm)">All patients have been attended to. The system is monitoring for new emergencies.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="incoming-grid">${requests.map(req => renderPatientCard(req)).join('')}</div>`;

  // Initialize mini maps
  requests.forEach(req => {
    const mapEl = document.getElementById(`mini-map-${req.id}`);
    if (mapEl && !miniMaps[req.id]) {
      try {
        const map = MapHelper.initMiniMap(`mini-map-${req.id}`, req.lat, req.lng, 14);

        // Patient marker
        MapHelper.createMarker(map, req.lat, req.lng, MapHelper.createPatientIcon(), 'Patient Location');

        // Ambulance marker if assigned
        if (req.assignedAmbulance) {
          const amb = GoldenHourData.getAmbulances().find(a => a.id === req.assignedAmbulance);
          if (amb) {
            MapHelper.createMarker(map, amb.lat, amb.lng, MapHelper.createAmbulanceIcon('en-route'), amb.vehicleNo);
            MapHelper.fitBounds(map, [
              [req.lat, req.lng],
              [amb.lat, amb.lng]
            ]);
          }
        }

        miniMaps[req.id] = map;
      } catch (e) {
        console.error('Error initializing mini-map:', e);
      }
    }
  });
}

function renderPatientCard(req) {
  const emergency = App.getEmergencyInfo(req.emergencyType);
  const goldenRemaining = App.getGoldenHourRemaining(req.goldenHourStart || req.createdAt);
  const goldenFormatted = App.formatGoldenHour(goldenRemaining);
  const ambulances = GoldenHourData.getAmbulances();
  const amb = req.assignedAmbulance ? ambulances.find(a => a.id === req.assignedAmbulance) : null;
  const checklist = PREP_CHECKLISTS[req.emergencyType] || PREP_CHECKLISTS.other;
  const prepStatus = req.preparationStatus || {};

  let goldenClass = '';
  if (goldenRemaining < 10 * 60 * 1000) goldenClass = 'critical';
  else if (goldenRemaining < 30 * 60 * 1000) goldenClass = 'warning';

  return `
    <div class="patient-card">
      <div class="patient-card-top">
        <div class="emergency-label">
          <span>${emergency.icon}</span>
          <span>${emergency.label}</span>
        </div>
        <span class="badge badge-${emergency.priority === 'critical' ? 'red' : emergency.priority === 'high' ? 'amber' : 'blue'}">
          ${emergency.priority}
        </span>
      </div>

      <div class="patient-card-body">
        <!-- Golden Hour Timer -->
        <div class="golden-timer ${goldenClass}" style="margin-bottom:var(--space-md)">
          <span>⏱️</span>
          <div>
            <div class="golden-timer-value">${goldenFormatted}</div>
            <div class="golden-timer-label">Golden Hour Remaining</div>
          </div>
        </div>

        <!-- Patient Info -->
        <div class="patient-info-grid">
          <div class="patient-info-item">
            <div class="label">Patient</div>
            <div class="value">👤 ${req.patientName}</div>
          </div>
          <div class="patient-info-item">
            <div class="label">Age</div>
            <div class="value">${req.patientAge || 'N/A'} yrs</div>
          </div>
          <div class="patient-info-item">
            <div class="label">ETA</div>
            <div class="value" style="color:var(--emergency-red)">${req.eta || '—'} min</div>
          </div>
          <div class="patient-info-item">
            <div class="label">Status</div>
            <div class="value">${req.status.replace('-', ' ').toUpperCase()}</div>
          </div>
          ${req.medicalCondition ? `
          <div class="patient-info-item" style="grid-column:span 2">
            <div class="label">Medical Condition</div>
            <div class="value">💊 ${req.medicalCondition}</div>
          </div>
          ` : ''}
        </div>

        <!-- Ambulance Info -->
        ${amb ? `
        <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;font-size:0.85rem;color:var(--text-secondary);border-top:1px solid var(--border-subtle);margin-top:var(--space-sm);padding-top:var(--space-sm)">
          🚑 ${amb.vehicleNo} (${amb.type}) · 👨‍✈️ ${amb.driver}
        </div>
        ` : ''}

        <!-- Mini Map -->
        <div class="patient-mini-map" id="mini-map-${req.id}"></div>

        <!-- Preparation Checklist -->
        <div class="prep-checklist">
          <h5>🔧 Preparation Checklist</h5>
          ${checklist.map((item, i) => {
            const done = prepStatus[i] === true;
            return `
              <div class="prep-item ${done ? 'done' : ''}" onclick="togglePrep('${req.id}', ${i}, this)">
                <div class="prep-check">${done ? '✓' : ''}</div>
                <span>${item}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="patient-card-actions">
        <button class="btn btn-sm btn-primary" onclick="assignDoctor('${req.id}')">👨‍⚕️ Assign Doctor</button>
        <button class="btn btn-sm btn-success" onclick="markReady('${req.id}')">✅ Ready</button>
        <button class="btn btn-sm btn-outline" onclick="patientArrived('${req.id}')" style="margin-left:auto">🏁 Arrived</button>
      </div>
    </div>
  `;
}

function togglePrep(requestId, index, el) {
  el.classList.toggle('done');
  const checkEl = el.querySelector('.prep-check');
  const isDone = el.classList.contains('done');
  checkEl.textContent = isDone ? '✓' : '';

  // Save to request
  const req = GoldenHourData.getRequests().find(r => r.id === requestId);
  if (req) {
    const prepStatus = req.preparationStatus || {};
    prepStatus[index] = isDone;
    GoldenHourData.updateRequest(requestId, { preparationStatus: prepStatus });
  }
}

function assignDoctor(requestId) {
  const doctors = ['Dr. Sharma (Cardiology)', 'Dr. Patel (Trauma)', 'Dr. Singh (Neurology)', 'Dr. Kumar (General)', 'Dr. Reddy (Orthopedics)'];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];

  GoldenHourData.updateRequest(requestId, { doctorAssigned: doctor });
  App.showToast('success', 'Doctor Assigned', `${doctor} has been assigned to this patient.`);
}

function markReady(requestId) {
  App.showToast('success', 'Ready!', 'ER/ICU is prepared for the incoming patient.');
}

function patientArrived(requestId) {
  GoldenHourData.updateRequest(requestId, { status: 'completed' });

  const req = GoldenHourData.getRequests().find(r => r.id === requestId);
  if (req && req.assignedAmbulance) {
    GoldenHourData.updateAmbulance(req.assignedAmbulance, { status: 'available' });
  }

  App.showToast('success', 'Patient Arrived', 'Patient has been received. Ambulance released.');
  renderHospitalStats();
  renderIncomingPatients();
}

function refreshHospital() {
  renderHospitalStats();
  renderIncomingPatients();
  App.showToast('info', 'Refreshed', 'Dashboard data updated.');
}
