/* ============================================================
   GOLDEN HOUR — Map Helpers (Leaflet.js API)
   Custom markers, route drawing, map initialization
   ============================================================ */

const MapHelper = (() => {

  // ── Custom Marker SVGs ──
  function getAmbulanceMarkerIcon(status) {
    const colors = {
      available: '#43A047',
      'en-route': '#FF8F00',
      busy: '#E53935',
      offline: '#64748B',
    };
    const color = colors[status] || colors.available;
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
          <circle cx="22" cy="22" r="18" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="22" y="28" text-anchor="middle" font-size="20">🚑</text>
          <polygon points="22,48 16,38 28,38" fill="${color}"/>
        </svg>
      `)}`,
      scaledSize: { width: 44, height: 52 },
      anchor: { x: 22, y: 52 },
    };
  }

  function getPatientMarkerIcon() {
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <circle cx="24" cy="24" r="20" fill="#E53935" stroke="white" stroke-width="3"/>
          <text x="24" y="31" text-anchor="middle" font-size="22">🆘</text>
          <polygon points="24,52 17,40 31,40" fill="#E53935"/>
        </svg>
      `)}`,
      scaledSize: { width: 48, height: 56 },
      anchor: { x: 24, y: 56 },
    };
  }

  function getHospitalMarkerIcon(type) {
    const color = type === 'Government' ? '#2E7D32' : '#1E88E5'; // Green for Govt, Blue for Private
    const label = type === 'Government' ? '🏛️' : '🏥';
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 42 50">
          <circle cx="21" cy="21" r="17" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="21" y="28" text-anchor="middle" font-size="18">${label}</text>
          <polygon points="21,46 15,36 27,36" fill="${color}"/>
        </svg>
      `)}`,
      scaledSize: { width: 42, height: 50 },
      anchor: { x: 21, y: 50 },
    };
  }

  // ── Map Initialization ──
  function initMap(elementId, options = {}) {
    let lat = GoldenHourData.CENTER_LAT;
    let lng = GoldenHourData.CENTER_LNG;
    if (options.center) {
      if (Array.isArray(options.center)) {
        lat = options.center[0];
        lng = options.center[1];
      } else if (options.center.lat !== undefined) {
        lat = options.center.lat;
        lng = options.center.lng;
      }
    }

    const map = L.map(elementId, {
      center: [lat, lng],
      zoom: options.zoom || 13,
      zoomControl: options.zoomControl !== false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Mock Google Maps methods on Leaflet Map (setCenter only — keep native getCenter/zoom)
    map.setCenter = function(latLng) {
      if (Array.isArray(latLng)) {
        this.setView(latLng, this.getZoom());
      } else if (latLng && latLng.lat !== undefined && latLng.lng !== undefined) {
        this.setView([latLng.lat, latLng.lng], this.getZoom());
      }
    };

    // NOTE: Do NOT override getCenter — Leaflet's native getCenter() returns
    // a L.LatLng object with numeric .lat and .lng properties.

    // Mock addListener for compatibility
    map.addListener = function(event, callback) {
      if (event === 'idle') {
        this.on('moveend', callback);
      } else {
        this.on(event, callback);
      }
    };

    return map;
  }

  function initMiniMap(elementId, centerLat, centerLng, zoom = 14) {
    const map = L.map(elementId, {
      center: [centerLat, centerLng],
      zoom: zoom,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Mock setCenter for mini maps — keep native getCenter/zoom
    map.setCenter = function(latLng) {
      if (Array.isArray(latLng)) {
        this.setView(latLng, this.getZoom());
      } else if (latLng && latLng.lat !== undefined && latLng.lng !== undefined) {
        this.setView([latLng.lat, latLng.lng], this.getZoom());
      }
    };

    return map;
  }

  // ── Create Marker ──
  function createMarker(map, lat, lng, iconObj, title, popupHTML, draggable = false) {
    const icon = L.icon({
      iconUrl: iconObj.url,
      iconSize: [iconObj.scaledSize.width, iconObj.scaledSize.height],
      iconAnchor: [iconObj.anchor.x, iconObj.anchor.y],
      popupAnchor: [0, -iconObj.scaledSize.height]
    });

    const marker = L.marker([lat, lng], {
      icon: icon,
      title: title || '',
      draggable: !!draggable
    }).addTo(map);

    if (popupHTML) {
      marker.bindPopup(`<div style="font-family:'Inter',sans-serif;color:#fff;min-width:180px;">${popupHTML}</div>`);
      
      // Auto-open on click is native in Leaflet when popup is bound,
      // but let's mock infoWindow for manual calls
      marker._infoWindow = {
        open: function(m, mk) {
          mk.openPopup();
        }
      };
    }

    // Google maps compatibility layer on marker object
    marker.setPosition = function(latLng) {
      if (latLng && latLng.lat !== undefined && latLng.lng !== undefined) {
        this.setLatLng([latLng.lat, latLng.lng]);
      } else if (Array.isArray(latLng)) {
        this.setLatLng(latLng);
      }
    };

    marker.getPosition = function() {
      const latLng = this.getLatLng();
      return {
        lat: () => latLng.lat,
        lng: () => latLng.lng,
        latVal: latLng.lat,
        lngVal: latLng.lng
      };
    };

    marker.addListener = function(event, callback) {
      this.on(event, (e) => {
        if (event === 'dragend') {
          callback();
        } else {
          callback(e);
        }
      });
    };

    return marker;
  }

  // ── Draw Route ──
  function drawRoute(map, from, to, color = '#1E88E5') {
    // Leaflet route: since we don't have Directions API, we draw a simple polyline
    const polyline = L.polyline([from, to], {
      color: color,
      weight: 5,
      opacity: 0.8
    }).addTo(map);
    
    // Mock the directionsRenderer
    return {
      setMap: function(m) {
        if (m === null) {
          polyline.remove();
        } else {
          polyline.addTo(m);
        }
      },
      setDirections: function() {}
    };
  }

  // ── Draw Simple Polyline (fallback) ──
  function drawPolyline(map, points, color = '#1E88E5') {
    return L.polyline(points, {
      color: color,
      weight: 4,
      opacity: 0.8
    }).addTo(map);
  }

  // ── Ambulance Movement Simulation ──
  function simulateMovement(ambulanceLat, ambulanceLng, targetLat, targetLng, progress) {
    const lat = ambulanceLat + (targetLat - ambulanceLat) * progress;
    const lng = ambulanceLng + (targetLng - ambulanceLng) * progress;
    return {
      lat: lat + (Math.random() - 0.5) * 0.0005,
      lng: lng + (Math.random() - 0.5) * 0.0005,
    };
  }

  // ── Add Ambulance Markers ──
  function addAmbulanceMarkers(map, ambulances, onClick) {
    const markers = [];
    ambulances.forEach(amb => {
      const icon = getAmbulanceMarkerIcon(amb.status);
      const typeColor = amb.type === 'ALS' ? '#FF5252' : '#42A5F5';
      const popupHTML = `
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">🚑 ${amb.vehicleNo}</div>
        <div style="font-size:12px;color:#ccc;margin-bottom:8px;">
          <span style="background:${typeColor}22;color:${typeColor};padding:2px 6px;border-radius:4px;font-weight:600;">${amb.type}</span>
          &nbsp; ${amb.status.toUpperCase()}
        </div>
        <div style="font-size:12px;">👨‍✈️ ${amb.driver}</div>
        <div style="font-size:12px;">📞 ${amb.driverPhone}</div>
      `;

      const marker = createMarker(map, amb.lat, amb.lng, icon, amb.vehicleNo, popupHTML);

      if (onClick) {
        marker.on('click', () => onClick(amb));
      }

      markers.push({ id: amb.id, marker });
    });
    return markers;
  }

  // ── Add Hospital Markers ──
  function addHospitalMarkers(map, hospitals) {
    const markers = [];
    hospitals.forEach(h => {
      const icon = getHospitalMarkerIcon(h.type);
      const typeBadge = h.type === 'Government' 
        ? '<span style="background:#2E7D3222;color:#81c784;border:1px solid #2E7D3255;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;display:inline-block;margin-bottom:6px;">GOVERNMENT</span>' 
        : '<span style="background:#1E88E522;color:#64b5f6;border:1px solid #1E88E555;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;display:inline-block;margin-bottom:6px;">PRIVATE</span>';
      const popupHTML = `
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">🏥 ${h.name}</div>
        <div>${typeBadge}</div>
        <div style="font-size:12px;margin-bottom:4px;">🛏️ ${h.beds} Beds | ICU: ${h.icuBeds}</div>
        <div style="font-size:11px;color:#ccc;">${h.specialties.join(', ')}</div>
      `;
      const marker = createMarker(map, h.lat, h.lng, icon, h.name, popupHTML);
      markers.push({ id: h.id, hospitalId: h.id, marker });
    });
    // Store globally for locate-on-map feature
    window._hospitalMarkers = markers;
    return markers;
  }

  // ── Fit Map to Bounds ──
  function fitBounds(map, points) {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => {
        if (Array.isArray(p)) return p;
        if (p.latVal !== undefined) return [p.latVal, p.lngVal];
        if (p.lat !== undefined && typeof p.lat === 'number') return [p.lat, p.lng];
        if (p.lat !== undefined && typeof p.lat === 'function') return [p.lat(), p.lng()];
        return p;
      }));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  // ── Helper: extract numeric lat/lng from map center (works with native Leaflet getCenter) ──
  function getMapCenterLatLng(map) {
    const c = map.getCenter(); // Leaflet L.LatLng — has numeric .lat and .lng
    return {
      lat: typeof c.lat === 'function' ? c.lat() : Number(c.lat),
      lng: typeof c.lng === 'function' ? c.lng() : Number(c.lng),
    };
  }

  // ── Load Real-time simulated hospitals ──
  function loadRealHospitals(map, callback) {
    // Extract map center safely using native Leaflet getCenter()
    const center = getMapCenterLatLng(map);
    const lat = center.lat;
    const lng = center.lng;

    const hospitalTemplates = [
      { name: "Fortis Specialty Clinic", specialties: ["Trauma", "Cardiology", "Neurology"] },
      { name: "Apollo Diagnostics", specialties: ["Trauma Care", "Emergency Care"] },
      { name: "Max Emergency Care", specialties: ["Neurology", "Orthopedics"] },
      { name: "Manipal Trauma Center", specialties: ["General Medicine", "Trauma"] },
      { name: "Holy Family ER", specialties: ["Emergency Care", "Pediatrics"] },
      { name: "City Civil Trauma Hospital", specialties: ["General Medicine", "Surgery"], isGovt: true },
      { name: "ESIC General Hospital", specialties: ["Trauma", "General Medicine"], isGovt: true },
      { name: "District Emergency Hospital", specialties: ["Trauma Care", "Obstetrics"], isGovt: true }
    ];

    // Skip if coordinates are invalid (NaN or 0,0)
    if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) {
      if (callback) callback([]);
      return;
    }

    // Generate 5 dynamic hospitals around the current center coordinates
    const results = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.04;
      const offsetLng = (Math.random() - 0.5) * 0.04;
      const template = hospitalTemplates[i % hospitalTemplates.length];
      const isGovt = template.isGovt || false;

      results.push({
        id: `h-dyn-${i}-${Math.round(lat * 1000)}-${Math.round(lng * 1000)}`,
        name: template.name + " " + (isGovt ? "Govt" : "Branch"),
        type: isGovt ? 'Government' : 'Private',
        lat: lat + offsetLat,
        lng: lng + offsetLng,
        beds: Math.floor(Math.random() * 80) + 40,
        icuBeds: Math.floor(Math.random() * 15) + 5,
        erReady: true,
        specialties: template.specialties,
        phone: '+91 11 ' + (Math.floor(Math.random() * 9000000) + 1000000),
      });
    }

    setTimeout(() => {
      if (callback) callback(results);
    }, 200);
  }

  // ── Public API ──
  return {
    GOOGLE_MAPS_API_KEY: '',
    DARK_MAP_STYLE: [],
    initMap,
    initMiniMap,
    loadRealHospitals,
    getMapCenterLatLng,
    createMarker,
    createPatientIcon: getPatientMarkerIcon,
    createAmbulanceIcon: getAmbulanceMarkerIcon,
    createHospitalIcon: getHospitalMarkerIcon,
    getAmbulanceMarkerIcon,
    getPatientMarkerIcon,
    getHospitalMarkerIcon,
    drawRoute,
    drawPolyline,
    simulateMovement,
    addAmbulanceMarkers,
    addHospitalMarkers,
    fitBounds,
  };
})();
