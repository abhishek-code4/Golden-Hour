/* ============================================================
   GOLDEN HOUR — Admin Dashboard Logic
   Fleet management, analytics, charts, driver performance
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const user = App.requireAuth(['admin']);
  if (!user) return;
  App.injectNavbar('admin');

  renderAdminStats();
  renderFleetTable();
  renderPeakHoursChart();
  renderDriverPerformance();
});

function renderAdminStats() {
  const analytics = GoldenHourData.getAnalytics();
  const ambulances = GoldenHourData.getAmbulances();

  document.getElementById('admin-stats').innerHTML = `
    <div class="admin-stat-card">
      <div class="stat-icon">🚑</div>
      <div class="stat-value" style="color:var(--medical-blue)">${ambulances.length}</div>
      <div class="stat-label">Total Fleet</div>
      <div class="stat-change up">↑ ${ambulances.filter(a => a.status !== 'offline').length} active</div>
    </div>
    <div class="admin-stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-value" style="color:var(--success-green)">${analytics.totalTrips.toLocaleString()}</div>
      <div class="stat-label">Total Trips</div>
      <div class="stat-change up">↑ ${analytics.todayTrips} today</div>
    </div>
    <div class="admin-stat-card">
      <div class="stat-icon">⏱️</div>
      <div class="stat-value" style="color:var(--warning-amber)">${analytics.avgResponseTime}</div>
      <div class="stat-label">Avg Response (min)</div>
      <div class="stat-change up">↑ 12% improvement</div>
    </div>
    <div class="admin-stat-card">
      <div class="stat-icon">🎯</div>
      <div class="stat-value" style="color:var(--emergency-red)">${analytics.goldenHourSuccess}%</div>
      <div class="stat-label">Golden Hour Rate</div>
      <div class="stat-change up">↑ 3% vs last month</div>
    </div>
  `;
}

function renderFleetTable() {
  const ambulances = GoldenHourData.getAmbulances();
  const tbody = document.getElementById('fleet-body');
  document.getElementById('fleet-count').textContent = `${ambulances.length} vehicles`;

  tbody.innerHTML = ambulances.map(amb => {
    const statusBadge = {
      available: 'green',
      'en-route': 'amber',
      busy: 'red',
      offline: 'purple',
    };

    const fuelColor = amb.fuelLevel > 70 ? 'var(--success-green)' : amb.fuelLevel > 40 ? 'var(--warning-amber)' : 'var(--emergency-red)';

    return `
      <tr>
        <td><strong>${amb.vehicleNo}</strong></td>
        <td><span class="badge badge-${amb.type === 'ALS' ? 'red' : 'blue'}">${amb.type}</span></td>
        <td>
          <div style="font-weight:500">${amb.driver}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${amb.driverPhone}</div>
        </td>
        <td><span class="badge badge-${statusBadge[amb.status] || 'blue'}">${amb.status}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:var(--space-sm)">
            <div class="progress-bar" style="width:60px;height:6px">
              <div class="progress-bar-fill" style="width:${amb.fuelLevel}%;background:${fuelColor}"></div>
            </div>
            <span style="font-size:0.8rem">${amb.fuelLevel}%</span>
          </div>
        </td>
        <td>${amb.totalTrips}</td>
        <td>${amb.avgResponseTime} min</td>
        <td style="font-size:0.8rem">${amb.lastMaintenance}</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline" onclick="toggleAmbulanceStatus('${amb.id}')" title="Toggle Status">
              ${amb.status === 'offline' ? '🟢' : '🔴'}
            </button>
            <button class="btn btn-sm btn-outline" onclick="editAmbulance('${amb.id}')" title="Edit">✏️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderPeakHoursChart() {
  const analytics = GoldenHourData.getAnalytics();
  const maxCount = Math.max(...analytics.peakHours.map(h => h.count));
  const chart = document.getElementById('peak-chart');

  chart.innerHTML = analytics.peakHours.map(h => {
    const height = (h.count / maxCount) * 170;
    const color = h.count > 35 ? 'var(--emergency-red)' : h.count > 20 ? 'var(--warning-amber)' : 'var(--medical-blue)';

    return `
      <div class="bar-item">
        <div class="bar" style="height:${height}px;background:${color}" data-value="${h.count} trips"></div>
        <span class="bar-label">${h.hour.replace(' ', '')}</span>
      </div>
    `;
  }).join('');
}

function renderDriverPerformance() {
  const ambulances = GoldenHourData.getAmbulances();
  const grid = document.getElementById('performance-grid');

  // Sort by trips (descending)
  const sorted = [...ambulances].sort((a, b) => b.totalTrips - a.totalTrips);

  grid.innerHTML = sorted.slice(0, 4).map(amb => {
    const rating = amb.avgResponseTime < 8 ? '⭐⭐⭐⭐⭐' : amb.avgResponseTime < 10 ? '⭐⭐⭐⭐' : '⭐⭐⭐';

    return `
      <div class="perf-card">
        <div class="perf-card-header">
          <div class="perf-avatar">👨‍✈️</div>
          <div>
            <div class="perf-name">${amb.driver}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${amb.vehicleNo}</div>
          </div>
        </div>
        <div class="perf-stats">
          <span>🚑 ${amb.totalTrips} trips</span>
          <span>⏱️ ${amb.avgResponseTime}m avg</span>
        </div>
        <div style="margin-top:var(--space-sm);font-size:0.75rem">
          ${rating}
        </div>
      </div>
    `;
  }).join('');
}

function toggleAmbulanceStatus(id) {
  const amb = GoldenHourData.getAmbulances().find(a => a.id === id);
  if (!amb) return;

  const newStatus = amb.status === 'offline' ? 'available' : 'offline';
  GoldenHourData.updateAmbulance(id, { status: newStatus });
  App.showToast('info', 'Status Updated', `${amb.vehicleNo} is now ${newStatus.toUpperCase()}`);
  renderFleetTable();
  renderAdminStats();
}

function editAmbulance(id) {
  const amb = GoldenHourData.getAmbulances().find(a => a.id === id);
  if (!amb) return;

  App.showModal(`Edit ${amb.vehicleNo}`, `
    <div class="modal-form">
      <div class="form-group">
        <label class="form-label">Vehicle Number</label>
        <input type="text" class="form-input" id="edit-vehicle" value="${amb.vehicleNo}">
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="edit-type">
          <option value="ALS" ${amb.type === 'ALS' ? 'selected' : ''}>ALS (Advanced Life Support)</option>
          <option value="BLS" ${amb.type === 'BLS' ? 'selected' : ''}>BLS (Basic Life Support)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Driver Name</label>
        <input type="text" class="form-input" id="edit-driver" value="${amb.driver}">
      </div>
      <div class="form-group">
        <label class="form-label">Driver Phone</label>
        <input type="text" class="form-input" id="edit-phone" value="${amb.driverPhone}">
      </div>
      <div style="display:flex;gap:var(--space-sm);justify-content:flex-end;margin-top:var(--space-md)">
        <button class="btn btn-outline" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveAmbulanceEdit('${id}')">Save Changes</button>
      </div>
    </div>
  `);
}

function saveAmbulanceEdit(id) {
  GoldenHourData.updateAmbulance(id, {
    vehicleNo: document.getElementById('edit-vehicle').value,
    type: document.getElementById('edit-type').value,
    driver: document.getElementById('edit-driver').value,
    driverPhone: document.getElementById('edit-phone').value,
  });

  App.closeModal();
  App.showToast('success', 'Updated', 'Ambulance details have been saved.');
  renderFleetTable();
}

function showAddAmbulanceModal() {
  App.showModal('Add New Ambulance', `
    <div class="modal-form">
      <div class="form-group">
        <label class="form-label">Vehicle Number</label>
        <input type="text" class="form-input" id="new-vehicle" placeholder="DL-XX-AM-XXXX">
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="new-type">
          <option value="ALS">ALS (Advanced Life Support)</option>
          <option value="BLS">BLS (Basic Life Support)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Driver Name</label>
        <input type="text" class="form-input" id="new-driver" placeholder="Driver name">
      </div>
      <div class="form-group">
        <label class="form-label">Driver Phone</label>
        <input type="text" class="form-input" id="new-phone" placeholder="+91 XXXXX XXXXX">
      </div>
      <div style="display:flex;gap:var(--space-sm);justify-content:flex-end;margin-top:var(--space-md)">
        <button class="btn btn-outline" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addNewAmbulance()">Add Ambulance</button>
      </div>
    </div>
  `);
}

function addNewAmbulance() {
  const vehicle = document.getElementById('new-vehicle').value;
  const type = document.getElementById('new-type').value;
  const driver = document.getElementById('new-driver').value;
  const phone = document.getElementById('new-phone').value;

  if (!vehicle || !driver) {
    App.showToast('error', 'Missing Info', 'Please fill in vehicle number and driver name.');
    return;
  }

  const ambulances = GoldenHourData.getAmbulances();
  ambulances.push({
    id: 'amb-' + Date.now(),
    vehicleNo: vehicle,
    type: type,
    driver: driver,
    driverPhone: phone,
    status: 'available',
    lat: GoldenHourData.CENTER_LAT + (Math.random() - 0.5) * 0.04,
    lng: GoldenHourData.CENTER_LNG + (Math.random() - 0.5) * 0.04,
    speed: 0,
    fuelLevel: 100,
    lastMaintenance: new Date().toISOString().split('T')[0],
    totalTrips: 0,
    avgResponseTime: 0,
  });

  GoldenHourData.saveAmbulances(ambulances);
  App.closeModal();
  App.showToast('success', 'Ambulance Added', `${vehicle} has been added to the fleet.`);
  renderFleetTable();
  renderAdminStats();
}
