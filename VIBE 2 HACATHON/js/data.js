/* ============================================================
   GOLDEN HOUR — Mock Data Store
   All ambulances, hospitals, requests stored in-memory + localStorage
   ============================================================ */

const GoldenHourData = (() => {
  // ── Delhi NCR Center Coordinates ──
  const CENTER_LAT = 28.6139;
  const CENTER_LNG = 77.2090;

  // ── Demo Accounts ──
  const DEMO_ACCOUNTS = [
    { id: 'patient-1', name: 'Rahul Sharma', email: 'patient@demo.com', password: 'demo123', role: 'patient', phone: '+91 98765 43210', location: { lat: 28.6280, lng: 77.2190 }, medicalHistory: 'No known allergies' },
    { id: 'dispatcher-1', name: 'Priya Singh', email: 'dispatcher@demo.com', password: 'demo123', role: 'dispatcher', phone: '+91 98765 43211' },
    { id: 'hospital-1', name: 'Dr. Anil Kumar', email: 'hospital@demo.com', password: 'demo123', role: 'hospital', phone: '+91 98765 43212', hospitalId: 'h1' },
    { id: 'admin-1', name: 'Vikram Patel', email: 'admin@demo.com', password: 'demo123', role: 'admin', phone: '+91 98765 43213' },
  ];

  // ── Ambulance Fleet ──
  const DEFAULT_AMBULANCES = [
    // Delhi
    { id: 'amb-1', hospitalId: 'h1', vehicleNo: 'DL-01-AM-1234', type: 'ALS', driver: 'Rajesh Kumar', driverPhone: '+91 99887 76655', status: 'available', lat: 28.5680, lng: 77.2110, speed: 40, fuelLevel: 85, lastMaintenance: '2026-06-20', totalTrips: 142, avgResponseTime: 8 },
    { id: 'amb-2', hospitalId: 'h1', vehicleNo: 'DL-02-AM-5678', type: 'BLS', driver: 'Suresh Yadav', driverPhone: '+91 99887 76656', status: 'available', lat: 28.5660, lng: 77.2090, speed: 35, fuelLevel: 92, lastMaintenance: '2026-06-18', totalTrips: 98, avgResponseTime: 10 },
    { id: 'amb-3', hospitalId: 'h2', vehicleNo: 'DL-03-AM-9012', type: 'ALS', driver: 'Amit Verma', driverPhone: '+91 99887 76657', status: 'en-route', lat: 28.5695, lng: 77.2055, speed: 55, fuelLevel: 60, lastMaintenance: '2026-06-22', totalTrips: 215, avgResponseTime: 7 },
    { id: 'amb-4', hospitalId: 'h3', vehicleNo: 'DL-04-AM-3456', type: 'BLS', driver: 'Mohit Gupta', driverPhone: '+91 99887 76658', status: 'available', lat: 28.6360, lng: 77.2185, speed: 30, fuelLevel: 78, lastMaintenance: '2026-06-15', totalTrips: 67, avgResponseTime: 12 },
    { id: 'amb-5', hospitalId: 'h2', vehicleNo: 'DL-05-AM-7890', type: 'ALS', driver: 'Deepak Joshi', driverPhone: '+91 99887 76659', status: 'offline', lat: 28.5675, lng: 77.2075, speed: 0, fuelLevel: 45, lastMaintenance: '2026-06-10', totalTrips: 189, avgResponseTime: 9 },
    { id: 'amb-6', hospitalId: 'h4', vehicleNo: 'DL-06-AM-2345', type: 'BLS', driver: 'Naveen Reddy', driverPhone: '+91 99887 76660', status: 'available', lat: 28.6515, lng: 77.1850, speed: 38, fuelLevel: 95, lastMaintenance: '2026-06-24', totalTrips: 55, avgResponseTime: 11 },
    { id: 'amb-7', hospitalId: 'h5', vehicleNo: 'DL-07-AM-6789', type: 'ALS', driver: 'Rahul Mehra', driverPhone: '+91 99887 76661', status: 'available', lat: 28.6245, lng: 77.2025, speed: 42, fuelLevel: 70, lastMaintenance: '2026-06-21', totalTrips: 176, avgResponseTime: 8 },
    { id: 'amb-8', hospitalId: 'h6', vehicleNo: 'DL-08-AM-0123', type: 'BLS', driver: 'Sanjay Tiwari', driverPhone: '+91 99887 76662', status: 'en-route', lat: 28.6350, lng: 77.2410, speed: 50, fuelLevel: 55, lastMaintenance: '2026-06-19', totalTrips: 130, avgResponseTime: 10 },

    // Mumbai
    { id: 'amb-9', hospitalId: 'h7', vehicleNo: 'MH-01-AM-1111', type: 'ALS', driver: 'Vikram Sawant', driverPhone: '+91 98200 12345', status: 'available', lat: 19.0035, lng: 72.8430, speed: 40, fuelLevel: 80, lastMaintenance: '2026-06-20', totalTrips: 120, avgResponseTime: 9 },
    { id: 'amb-10', hospitalId: 'h7', vehicleNo: 'MH-01-AM-2222', type: 'BLS', driver: 'Anil Jadhav', driverPhone: '+91 98200 54321', status: 'available', lat: 19.0020, lng: 72.8415, speed: 35, fuelLevel: 90, lastMaintenance: '2026-06-15', totalTrips: 90, avgResponseTime: 11 },
    { id: 'amb-11', hospitalId: 'h8', vehicleNo: 'MH-02-AM-3333', type: 'ALS', driver: 'Dinesh Patil', driverPhone: '+91 98200 98765', status: 'available', lat: 19.0045, lng: 72.8438, speed: 45, fuelLevel: 75, lastMaintenance: '2026-06-22', totalTrips: 145, avgResponseTime: 8 },
    { id: 'amb-12', hospitalId: 'h9', vehicleNo: 'MH-03-AM-4444', type: 'ALS', driver: 'Ganesh More', driverPhone: '+91 98200 67890', status: 'available', lat: 19.1320, lng: 72.8265, speed: 40, fuelLevel: 85, lastMaintenance: '2026-06-24', totalTrips: 60, avgResponseTime: 10 },

    // Bangalore
    { id: 'amb-13', hospitalId: 'h11', vehicleNo: 'KA-01-AM-5555', type: 'ALS', driver: 'Manjunath Gowda', driverPhone: '+91 98450 12345', status: 'available', lat: 12.9370, lng: 77.5980, speed: 38, fuelLevel: 92, lastMaintenance: '2026-06-21', totalTrips: 110, avgResponseTime: 9 },
    { id: 'amb-14', hospitalId: 'h11', vehicleNo: 'KA-01-AM-6666', type: 'BLS', driver: 'Ramesh Gowda', driverPhone: '+91 98450 54321', status: 'available', lat: 12.9355, lng: 77.5965, speed: 35, fuelLevel: 88, lastMaintenance: '2026-06-16', totalTrips: 80, avgResponseTime: 12 },
    { id: 'amb-15', hospitalId: 'h12', vehicleNo: 'KA-02-AM-7777', type: 'BLS', driver: 'Srinivas Murthy', driverPhone: '+91 98450 98765', status: 'available', lat: 12.9640, lng: 77.5745, speed: 35, fuelLevel: 80, lastMaintenance: '2026-06-18', totalTrips: 70, avgResponseTime: 11 },
    { id: 'amb-16', hospitalId: 'h13', vehicleNo: 'KA-03-AM-8888', type: 'ALS', driver: 'Harish Babu', driverPhone: '+91 98450 67890', status: 'available', lat: 12.9600, lng: 77.6450, speed: 42, fuelLevel: 75, lastMaintenance: '2026-06-25', totalTrips: 135, avgResponseTime: 8 },

    // Chennai
    { id: 'amb-17', hospitalId: 'h15', vehicleNo: 'TN-01-AM-9999', type: 'ALS', driver: 'Karthik Raja', driverPhone: '+91 98400 12345', status: 'available', lat: 13.0825, lng: 80.2785, speed: 40, fuelLevel: 85, lastMaintenance: '2026-06-20', totalTrips: 155, avgResponseTime: 8 },
    { id: 'amb-18', hospitalId: 'h15', vehicleNo: 'TN-01-AM-0000', type: 'BLS', driver: 'Muthu Kumar', driverPhone: '+91 98400 54321', status: 'available', lat: 13.0810, lng: 80.2770, speed: 35, fuelLevel: 95, lastMaintenance: '2026-06-19', totalTrips: 100, avgResponseTime: 10 },
    { id: 'amb-19', hospitalId: 'h17', vehicleNo: 'TN-02-AM-1111', type: 'ALS', driver: 'Subramanian V', driverPhone: '+91 98400 98765', status: 'available', lat: 13.0610, lng: 80.2535, speed: 45, fuelLevel: 82, lastMaintenance: '2026-06-22', totalTrips: 165, avgResponseTime: 7 },

    // Kolkata
    { id: 'amb-20', hospitalId: 'h18', vehicleNo: 'WB-01-AM-2222', type: 'ALS', driver: 'Subrata Das', driverPhone: '+91 98300 12345', status: 'available', lat: 22.5405, lng: 88.3450, speed: 38, fuelLevel: 78, lastMaintenance: '2026-06-21', totalTrips: 125, avgResponseTime: 9 },
    { id: 'amb-21', hospitalId: 'h18', vehicleNo: 'WB-01-AM-3333', type: 'BLS', driver: 'Tarun Sen', driverPhone: '+91 98300 54321', status: 'available', lat: 22.5390, lng: 88.3438, speed: 32, fuelLevel: 90, lastMaintenance: '2026-06-23', totalTrips: 65, avgResponseTime: 12 },
    { id: 'amb-22', hospitalId: 'h20', vehicleNo: 'WB-02-AM-4444', type: 'ALS', driver: 'Pradip Roy', driverPhone: '+91 98300 98765', status: 'available', lat: 22.5125, lng: 88.3690, speed: 40, fuelLevel: 85, lastMaintenance: '2026-06-24', totalTrips: 85, avgResponseTime: 10 },

    // Hyderabad
    { id: 'amb-23', hospitalId: 'h21', vehicleNo: 'TS-01-AM-5555', type: 'ALS', driver: 'Raju Goud', driverPhone: '+91 98480 12345', status: 'available', lat: 17.3780, lng: 78.4730, speed: 40, fuelLevel: 88, lastMaintenance: '2026-06-20', totalTrips: 140, avgResponseTime: 8 },
    { id: 'amb-24', hospitalId: 'h21', vehicleNo: 'TS-01-AM-6666', type: 'BLS', driver: 'Srinivas Reddy', driverPhone: '+91 98480 54321', status: 'available', lat: 17.3770, lng: 78.4715, speed: 35, fuelLevel: 92, lastMaintenance: '2026-06-18', totalTrips: 95, avgResponseTime: 10 },
    { id: 'amb-25', hospitalId: 'h23', vehicleNo: 'TS-02-AM-7777', type: 'ALS', driver: 'Venkat Rao', driverPhone: '+91 98480 98765', status: 'available', lat: 17.4330, lng: 78.4495, speed: 45, fuelLevel: 70, lastMaintenance: '2026-06-22', totalTrips: 170, avgResponseTime: 7 }
  ];

  // ── Hospitals ──
    const DEFAULT_HOSPITALS = [
    { id: "h1", name: "AIIMS Delhi", type: "Government", lat: 28.5672, lng: 77.21, beds: 120, icuBeds: 15, erReady: true, specialties: ["Trauma", "Cardiology", "Neurology", "Orthopedics"], phone: "+91 11 2658 8500" },
    { id: "h2", name: "Safdarjung Hospital", type: "Government", lat: 28.5686, lng: 77.2069, beds: 95, icuBeds: 10, erReady: true, specialties: ["General Surgery", "Orthopedics", "Obstetrics"], phone: "+91 11 2619 8400" },
    { id: "h3", name: "Max Super Specialty Delhi", type: "Private", lat: 28.6369, lng: 77.2172, beds: 80, icuBeds: 20, erReady: true, specialties: ["Cardiology", "Neurology", "Oncology"], phone: "+91 11 2651 5050" },
    { id: "h4", name: "Fortis Hospital Delhi", type: "Private", lat: 28.6508, lng: 77.1866, beds: 65, icuBeds: 12, erReady: true, specialties: ["Trauma", "Burns", "Pediatrics"], phone: "+91 11 4277 6222" },
    { id: "h5", name: "Ram Manohar Lohia Hospital Delhi", type: "Government", lat: 28.6253, lng: 77.2014, beds: 110, icuBeds: 14, erReady: true, specialties: ["Trauma", "Cardiology", "Emergency Care"], phone: "+91 11 2336 5500" },
    { id: "h6", name: "Lok Nayak Hospital Delhi (LNJP)", type: "Government", lat: 28.636, lng: 77.2396, beds: 150, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Surgery", "Pediatrics"], phone: "+91 11 2323 2400" },
    { id: "h7", name: "KEM Hospital Mumbai", type: "Government", lat: 19.0028, lng: 72.8422, beds: 130, icuBeds: 20, erReady: true, specialties: ["Trauma", "General Medicine", "Cardiology"], phone: "+91 22 2410 7000" },
    { id: "h8", name: "Tata Memorial Hospital Mumbai", type: "Government", lat: 19.0041, lng: 72.8432, beds: 100, icuBeds: 18, erReady: true, specialties: ["Oncology", "Emergency Care", "Surgery"], phone: "+91 22 2417 7000" },
    { id: "h9", name: "Kokilaben Dhirubhai Ambani Hospital Mumbai", type: "Private", lat: 19.1312, lng: 72.8258, beds: 90, icuBeds: 22, erReady: true, specialties: ["Neurology", "Cardiology", "Orthopedics"], phone: "+91 22 3099 9999" },
    { id: "h10", name: "Lilavati Hospital Mumbai", type: "Private", lat: 19.0515, lng: 72.8288, beds: 85, icuBeds: 15, erReady: true, specialties: ["Cardiology", "Pediatrics", "Obstetrics"], phone: "+91 22 2675 1000" },
    { id: "h11", name: "NIMHANS Bangalore", type: "Government", lat: 12.9362, lng: 77.5972, beds: 115, icuBeds: 25, erReady: true, specialties: ["Psychiatry", "Neurology", "Neurosurgery"], phone: "+91 80 2699 5000" },
    { id: "h12", name: "Victoria Hospital Bangalore", type: "Government", lat: 12.9634, lng: 77.5739, beds: 140, icuBeds: 18, erReady: true, specialties: ["Burns Clinic", "Trauma Care", "General Surgery"], phone: "+91 80 2670 1150" },
    { id: "h13", name: "Manipal Hospital Bangalore", type: "Private", lat: 12.9592, lng: 77.6444, beds: 95, icuBeds: 20, erReady: true, specialties: ["Oncology", "Cardiology", "Neurology"], phone: "+91 80 2502 4444" },
    { id: "h14", name: "Narayana Health City Bangalore", type: "Private", lat: 12.8122, lng: 77.6944, beds: 110, icuBeds: 30, erReady: true, specialties: ["Heart Center", "Organ Transplant", "Trauma"], phone: "+91 80 7122 2222" },
    { id: "h15", name: "Rajiv Gandhi General Hospital Chennai", type: "Government", lat: 13.0817, lng: 80.2778, beds: 160, icuBeds: 28, erReady: true, specialties: ["Trauma", "Cardiology", "Vascular Surgery"], phone: "+91 44 2530 5000" },
    { id: "h16", name: "Stanley Medical College Hospital Chennai", type: "Government", lat: 13.1022, lng: 80.2803, beds: 120, icuBeds: 15, erReady: true, specialties: ["Plastic Surgery", "Pediatrics", "Orthopedics"], phone: "+91 44 2528 0900" },
    { id: "h17", name: "Apollo Hospitals Greams Road Chennai", type: "Private", lat: 13.0603, lng: 80.2529, beds: 105, icuBeds: 25, erReady: true, specialties: ["Cardiology", "Neurology", "Oncology"], phone: "+91 44 2829 0200" },
    { id: "h18", name: "SSKM Hospital Kolkata", type: "Government", lat: 22.5397, lng: 88.3444, beds: 150, icuBeds: 24, erReady: true, specialties: ["Trauma Care", "General Surgery", "Cardiology"], phone: "+91 33 2204 1100" },
    { id: "h19", name: "Medical College Hospital Kolkata", type: "Government", lat: 22.5733, lng: 88.3639, beds: 130, icuBeds: 16, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 33 2241 3500" },
    { id: "h20", name: "AMRI Hospital Kolkata", type: "Private", lat: 22.5117, lng: 88.3683, beds: 75, icuBeds: 12, erReady: true, specialties: ["Cardiology", "Gastroenterology", "Neurology"], phone: "+91 33 6680 0000" },
    { id: "h21", name: "Osmania General Hospital Hyderabad", type: "Government", lat: 17.3775, lng: 78.4722, beds: 140, icuBeds: 20, erReady: true, specialties: ["Trauma", "General Medicine", "Cardiology"], phone: "+91 40 2460 0144" },
    { id: "h22", name: "Gandhi Hospital Hyderabad", type: "Government", lat: 17.4244, lng: 78.5036, beds: 120, icuBeds: 18, erReady: true, specialties: ["General Surgery", "Orthopedics", "Pediatrics"], phone: "+91 40 2750 5566" },
    { id: "h23", name: "Yashoda Hospital Secunderabad", type: "Private", lat: 17.4322, lng: 78.4489, beds: 90, icuBeds: 20, erReady: true, specialties: ["Cardiology", "Neurology", "Oncology"], phone: "+91 40 4567 4567" },
    { id: "h-wiki-1", name: "Sri Sathya Sai Institute of Higher Medical Sciences, Puttaparthi", type: "Private", lat: 14.6968, lng: 77.5987, beds: 104, icuBeds: 17, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 177 480" },
    { id: "h-wiki-2", name: "Sri Venkateswara Institute of Medical Sciences", type: "Government", lat: 13.6437, lng: 79.4173, beds: 293, icuBeds: 46, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 157 252" },
    { id: "h-wiki-3", name: "Dr. Mohan\u2019s Diabetes Specialities Centre", type: "Private", lat: 16.5211, lng: 80.6461, beds: 90, icuBeds: 10, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 253 972" },
    { id: "h-wiki-4", name: "Krishna Institute of Medical Sciences", type: "Government", lat: 16.5008, lng: 80.6275, beds: 309, icuBeds: 51, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 145 890" },
    { id: "h-wiki-5", name: "L. V. Prasad Eye Institute", type: "Private", lat: 16.4821, lng: 80.6578, beds: 118, icuBeds: 19, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 129 185" },
    { id: "h-wiki-6", name: "Manipal Hospital", type: "Private", lat: 16.521, lng: 80.6741, beds: 297, icuBeds: 27, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 462" },
    { id: "h-wiki-7", name: "Rainbow Hospital", type: "Private", lat: 16.533, lng: 80.6278, beds: 73, icuBeds: 12, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 670" },
    { id: "h-wiki-8", name: "Siddhartha Medical College, Dr. NTR University of Health Sciences", type: "Government", lat: 16.4805, lng: 80.6218, beds: 129, icuBeds: 22, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 176 596" },
    { id: "h-wiki-9", name: "Apollo Hospitals, Visakhapatnam", type: "Private", lat: 17.7017, lng: 83.2166, beds: 325, icuBeds: 47, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 139 338" },
    { id: "h-wiki-10", name: "Care Hospital", type: "Private", lat: 17.6814, lng: 83.198, beds: 101, icuBeds: 8, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 116 211" },
    { id: "h-wiki-11", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 17.6627, lng: 83.2283, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-12", name: "Government ENT Hospital, Visakhapatnam", type: "Government", lat: 17.7016, lng: 83.2446, beds: 312, icuBeds: 37, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 147 060" },
    { id: "h-wiki-13", name: "Government Regional Eye Hospital", type: "Government", lat: 17.7136, lng: 83.1983, beds: 265, icuBeds: 22, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 140 313" },
    { id: "h-wiki-14", name: "Government TB and Chest Hospital, Visakhapatnam", type: "Government", lat: 17.6611, lng: 83.1923, beds: 214, icuBeds: 36, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 157 369" },
    { id: "h-wiki-15", name: "Government Victoria Hospital", type: "Government", lat: 17.6623, lng: 83.2497, beds: 70, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 136 322" },
    { id: "h-wiki-16", name: "Homi Bhabha Cancer Hospital & Research Centre", type: "Private", lat: 17.7233, lng: 83.2402, beds: 151, icuBeds: 17, erReady: true, specialties: ["Oncology", "Radiotherapy", "Cancer Surgery"], phone: "+91 99887 152 507" },
    { id: "h-wiki-17", name: "King George Hospital", type: "Private", lat: 17.7047, lng: 83.1772, beds: 314, icuBeds: 26, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 124 622" },
    { id: "h-wiki-18", name: "Medicover Hospital", type: "Private", lat: 17.6412, lng: 83.2054, beds: 211, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 322" },
    { id: "h-wiki-19", name: "Rani Chandramani Devi Government Hospital", type: "Government", lat: 17.6794, lng: 83.2677, beds: 69, icuBeds: 10, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 150 973" },
    { id: "h-wiki-20", name: "SevenHills Hospital", type: "Private", lat: 17.7388, lng: 83.2196, beds: 205, icuBeds: 28, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 124 557" },
    { id: "h-wiki-21", name: "Visakha Institute of Medical Sciences", type: "Government", lat: 17.6809, lng: 83.1647, beds: 288, icuBeds: 50, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 145 773" },
    { id: "h-wiki-22", name: "All India Institute of Medical Sciences, Guwahati", type: "Government", lat: 26.1594, lng: 91.7343, beds: 212, icuBeds: 29, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 158 630" },
    { id: "h-wiki-23", name: "Apollo Hospitals", type: "Private", lat: 26.1391, lng: 91.7157, beds: 290, icuBeds: 35, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 774" },
    { id: "h-wiki-24", name: "Gauhati Medical College and Hospital", type: "Government", lat: 26.1204, lng: 91.746, beds: 213, icuBeds: 29, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 143 732" },
    { id: "h-wiki-25", name: "Narayana Superspeciality Hospital", type: "Private", lat: 26.1593, lng: 91.7623, beds: 341, icuBeds: 34, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 143 121" },
    { id: "h-wiki-26", name: "Assam Medical College", type: "Government", lat: 27.4877, lng: 94.9101, beds: 121, icuBeds: 15, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 125 363" },
    { id: "h-wiki-27", name: "SMCH \u2013 Silchar Medical College and Hospital", type: "Government", lat: 24.8482, lng: 92.777, beds: 208, icuBeds: 23, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 255 233" },
    { id: "h-wiki-28", name: "CCHRC", type: "Private", lat: 24.8279, lng: 92.7584, beds: 131, icuBeds: 11, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 104 615" },
    { id: "h-wiki-29", name: "Jorhat Medical College and Hospital", type: "Government", lat: 26.7658, lng: 94.2018, beds: 301, icuBeds: 43, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 142 549" },
    { id: "h-wiki-30", name: "Medical Institute Jorhat", type: "Private", lat: 26.7455, lng: 94.1832, beds: 283, icuBeds: 35, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 130 368" },
    { id: "h-wiki-31", name: "Lokopriya Gopinath Bordoloi Regional Institute of Mental Health", type: "Government", lat: 26.6677, lng: 92.7907, beds: 274, icuBeds: 23, erReady: true, specialties: ["Psychiatry", "Behavioral Sciences", "Neurology"], phone: "+91 99887 178 468" },
    { id: "h-wiki-32", name: "Tezpur Medical College and Hospital", type: "Government", lat: 26.6474, lng: 92.7721, beds: 269, icuBeds: 29, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 142 991" },
    { id: "h-wiki-33", name: "Diphu Medical College and Hospital", type: "Government", lat: 25.8523, lng: 93.4297, beds: 205, icuBeds: 25, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 141 119" },
    { id: "h-wiki-34", name: "Fakhruddin Ali Ahmed Medical College and Hospital", type: "Government", lat: 26.3411, lng: 91.0049, beds: 319, icuBeds: 49, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 158 526" },
    { id: "h-wiki-35", name: "Jawaharlal Nehru Medical College and Hospital", type: "Government", lat: 25.2574, lng: 87.0126, beds: 130, icuBeds: 15, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 154 834" },
    { id: "h-wiki-36", name: "All India Institute of Medical Sciences, Darbhanga", type: "Government", lat: 26.1691, lng: 85.8899, beds: 348, icuBeds: 58, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 159 436" },
    { id: "h-wiki-37", name: "Darbhanga Medical College and Hospital", type: "Government", lat: 26.1488, lng: 85.8713, beds: 85, icuBeds: 9, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 146 085" },
    { id: "h-wiki-38", name: "Mithila Minority Dental College and Hospital", type: "Private", lat: 26.1301, lng: 85.9016, beds: 243, icuBeds: 26, erReady: true, specialties: ["Dentistry", "Oral Surgery"], phone: "+91 99887 154 249" },
    { id: "h-wiki-39", name: "Anugrah Narayan Magadh Medical College and Hospital", type: "Government", lat: 24.8063, lng: 84.9983, beds: 308, icuBeds: 50, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 161 399" },
    { id: "h-wiki-40", name: "Katihar Medical College", type: "Government", lat: 25.553, lng: 87.5697, beds: 330, icuBeds: 41, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 128 054" },
    { id: "h-wiki-41", name: "Sri Krishna Medical College", type: "Government", lat: 26.1358, lng: 85.3628, beds: 113, icuBeds: 18, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 132 552" },
    { id: "h-wiki-42", name: "AIIMS Patna", type: "Government", lat: 25.609, lng: 85.1357, beds: 71, icuBeds: 10, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 111 739" },
    { id: "h-wiki-43", name: "Ford Hospital and Research Centre", type: "Private", lat: 25.5887, lng: 85.1171, beds: 304, icuBeds: 32, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 140 144" },
    { id: "h-wiki-44", name: "Medanta Hospital", type: "Private", lat: 25.57, lng: 85.1474, beds: 85, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 358" },
    { id: "h-wiki-45", name: "Guru Gobind Singh Hospital, Patna Sahib", type: "Private", lat: 25.6089, lng: 85.1637, beds: 249, icuBeds: 22, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 146 098" },
    { id: "h-wiki-46", name: "Indira Gandhi Institute of Medical Sciences", type: "Government", lat: 25.6209, lng: 85.1174, beds: 191, icuBeds: 24, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 152 364" },
    { id: "h-wiki-47", name: "Nalanda Medical College Hospital, Kankarbagh", type: "Government", lat: 25.5684, lng: 85.1114, beds: 306, icuBeds: 36, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 153 079" },
    { id: "h-wiki-48", name: "Patna Medical College Hospital, Ashok Raj Patna", type: "Government", lat: 25.5696, lng: 85.1688, beds: 251, icuBeds: 30, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 155 185" },
    { id: "h-wiki-49", name: "Narayan Medical College and Hospital", type: "Government", lat: 24.9639, lng: 84.0158, beds: 329, icuBeds: 47, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 143 823" },
    { id: "h-wiki-50", name: "Post Graduate Institute of Medical Education and Research, Sector 12", type: "Private", lat: 30.7482, lng: 76.7775, beds: 177, icuBeds: 28, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 180 639" },
    { id: "h-wiki-51", name: "All India Institute of Medical Sciences, Raipur", type: "Government", lat: 21.2663, lng: 81.6277, beds: 234, icuBeds: 40, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 156 043" },
    { id: "h-wiki-52", name: "Dr. B.R. Ambedkar Memorial Hospital", type: "Private", lat: 21.246, lng: 81.6091, beds: 183, icuBeds: 28, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 139 585" },
    { id: "h-wiki-53", name: "MMI Narayana Multispeciality Hospital", type: "Private", lat: 21.2273, lng: 81.6394, beds: 299, icuBeds: 44, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 146 436" },
    { id: "h-wiki-54", name: "CCM Medical College & CCMGMC Memorial Hospital", type: "Government", lat: 21.2053, lng: 81.3371, beds: 125, icuBeds: 16, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 150 843" },
    { id: "h-wiki-55", name: "CIMS Hospital, Bilaspur", type: "Private", lat: 22.0939, lng: 82.1372, beds: 70, icuBeds: 6, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 127 014" },
    { id: "h-wiki-56", name: "Ahmedabad Civil Hospital", type: "Government", lat: 23.0374, lng: 72.5695, beds: 337, icuBeds: 47, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 129 562" },
    { id: "h-wiki-57", name: "B.J. Medical College, Asarwa", type: "Government", lat: 23.0171, lng: 72.5509, beds: 338, icuBeds: 50, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 130 745" },
    { id: "h-wiki-58", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 22.9984, lng: 72.5812, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-59", name: "GCRI, Ahmedabad", type: "Private", lat: 23.0373, lng: 72.5975, beds: 286, icuBeds: 33, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 116 120" },
    { id: "h-wiki-60", name: "GMERS Medical College and Hospital, Ahmedabad", type: "Government", lat: 23.0493, lng: 72.5512, beds: 168, icuBeds: 20, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 151 818" },
    { id: "h-wiki-61", name: "Shalby Hospital", type: "Private", lat: 22.9968, lng: 72.5452, beds: 75, icuBeds: 11, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 227" },
    { id: "h-wiki-62", name: "Shantabaa Medical College Hospital, Amreli", type: "Government", lat: 21.6179, lng: 71.2201, beds: 333, icuBeds: 31, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 150 635" },
    { id: "h-wiki-63", name: "Government Medical College Hospital Bhavnagar", type: "Government", lat: 21.7794, lng: 72.15, beds: 120, icuBeds: 19, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 156 121" },
    { id: "h-wiki-64", name: "GMERS Medical College and Hospital, Gandhinagar", type: "Government", lat: 23.2305, lng: 72.635, beds: 349, icuBeds: 52, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 154 899" },
    { id: "h-wiki-65", name: "Irwin Group of Hospitals renamed as Guru Gobind Singh Hospital at M. P. Shah Medical College", type: "Government", lat: 22.4856, lng: 70.0558, beds: 262, icuBeds: 32, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 206 925" },
    { id: "h-wiki-66", name: "GMERS Medical College and Hospital, Junagadh", type: "Government", lat: 21.5371, lng: 70.456, beds: 303, icuBeds: 45, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 150 921" },
    { id: "h-wiki-67", name: "All India Institute of Medical Sciences, Rajkot & Pandit Deendayal Upadhyay Medical College Hospital, Rajkot", type: "Government", lat: 22.3188, lng: 70.8003, beds: 137, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 227 790" },
    { id: "h-wiki-68", name: "Baroda Medical College Hospitals at M S University", type: "Government", lat: 22.3221, lng: 73.1793, beds: 89, icuBeds: 9, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 159 917" },
    { id: "h-wiki-69", name: "GMERS Medical College and Hospital, Vadodara", type: "Government", lat: 22.3018, lng: 73.1607, beds: 303, icuBeds: 45, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 150 921" },
    { id: "h-wiki-70", name: "Metro Hospital & Research Institute", type: "Private", lat: 22.2831, lng: 73.191, beds: 159, icuBeds: 17, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 142 939" },
    { id: "h-wiki-71", name: "Smimer Hospital", type: "Private", lat: 21.1851, lng: 72.8292, beds: 266, icuBeds: 33, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 119 357" },
    { id: "h-wiki-72", name: "Muljibhai Patel Urological Hospital", type: "Private", lat: 22.7006, lng: 72.8579, beds: 74, icuBeds: 13, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 144 096" },
    { id: "h-wiki-73", name: "Meditrina Hospital", type: "Private", lat: 30.3931, lng: 76.7748, beds: 63, icuBeds: 8, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 123 309" },
    { id: "h-wiki-74", name: "Asian Institute of Medical Sciences", type: "Government", lat: 28.4238, lng: 77.3159, beds: 83, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 142 926" },
    { id: "h-wiki-75", name: "Fortis Escorts Hospital", type: "Private", lat: 28.4035, lng: 77.2973, beds: 192, icuBeds: 29, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 129 510" },
    { id: "h-wiki-76", name: "Metro Hospital", type: "Private", lat: 28.3848, lng: 77.3276, beds: 86, icuBeds: 12, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 118 031" },
    { id: "h-wiki-77", name: "Fortis Memorial Research Institute", type: "Private", lat: 28.4744, lng: 77.0247, beds: 157, icuBeds: 14, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 143 303" },
    { id: "h-wiki-78", name: "Manipal Hospital", type: "Private", lat: 28.4541, lng: 77.0061, beds: 297, icuBeds: 27, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 462" },
    { id: "h-wiki-79", name: "Max Hospital", type: "Private", lat: 28.4354, lng: 77.0364, beds: 291, icuBeds: 49, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 115 106" },
    { id: "h-wiki-80", name: "Medanta", type: "Private", lat: 28.4743, lng: 77.0527, beds: 235, icuBeds: 41, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 109 074" },
    { id: "h-wiki-81", name: "Motherhood Hospital", type: "Private", lat: 28.4863, lng: 77.0064, beds: 168, icuBeds: 14, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 124 921" },
    { id: "h-wiki-82", name: "Narayana Superspeciality Hospital", type: "Private", lat: 28.4338, lng: 77.0004, beds: 341, icuBeds: 34, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 143 121" },
    { id: "h-wiki-83", name: "Sukoon Health, Sector 56", type: "Private", lat: 28.435, lng: 77.0578, beds: 179, icuBeds: 17, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 127 404" },
    { id: "h-wiki-84", name: "Paras Hospital", type: "Private", lat: 28.496, lng: 77.0483, beds: 260, icuBeds: 29, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 117 823" },
    { id: "h-wiki-85", name: "Ganga Ram Hospital", type: "Private", lat: 29.1641, lng: 75.7198, beds: 334, icuBeds: 55, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 121 658" },
    { id: "h-wiki-86", name: "Navdeep Hospital", type: "Private", lat: 29.0737, lng: 76.0837, beds: 162, icuBeds: 14, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 475" },
    { id: "h-wiki-87", name: "NC Medical College and Hospital", type: "Government", lat: 29.0534, lng: 76.0651, beds: 215, icuBeds: 23, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 136 426" },
    { id: "h-wiki-88", name: "Deendayal Upadhyaya Hospital, Shimla", type: "Private", lat: 31.1197, lng: 77.1715, beds: 169, icuBeds: 17, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 144 447" },
    { id: "h-wiki-89", name: "Indira Gandhi Medical College and Hospital, Shimla", type: "Government", lat: 31.0994, lng: 77.1529, beds: 233, icuBeds: 18, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 159 241" },
    { id: "h-wiki-90", name: "All India Institute of Medical Sciences, Bilaspur", type: "Government", lat: 31.0807, lng: 77.1832, beds: 269, icuBeds: 25, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 158 734" },
    { id: "h-wiki-91", name: "Dr. Rajendra Prasad Government Medical College Kangra", type: "Government", lat: 31.1196, lng: 77.1995, beds: 187, icuBeds: 25, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 163 349" },
    { id: "h-wiki-92", name: "Shri Lal Bahadur Shastri Government Medical College and Hospital, Mandi", type: "Government", lat: 31.1316, lng: 77.1532, beds: 330, icuBeds: 51, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 184 851" },
    { id: "h-wiki-93", name: "Apollo Hospital", type: "Private", lat: 12.9865, lng: 77.5927, beds: 120, icuBeds: 18, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 279" },
    { id: "h-wiki-94", name: "Bangalore Medical College", type: "Government", lat: 12.9662, lng: 77.5741, beds: 219, icuBeds: 31, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 130 641" },
    { id: "h-wiki-95", name: "Basaveshwara Teaching and General Hospital, Gulbarga", type: "Government", lat: 12.9475, lng: 77.6044, beds: 276, icuBeds: 48, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 163 661" },
    { id: "h-wiki-96", name: "Bowring & Lady Curzon Hospitals", type: "Private", lat: 12.9864, lng: 77.6207, beds: 300, icuBeds: 47, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 137 440" },
    { id: "h-wiki-97", name: "Columbia Asia, Hebbal", type: "Private", lat: 12.9984, lng: 77.5744, beds: 245, icuBeds: 32, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 124 388" },
    { id: "h-wiki-98", name: "Columbia Asia, Yeshwanthpur", type: "Private", lat: 12.9459, lng: 77.5684, beds: 309, icuBeds: 39, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 800" },
    { id: "h-wiki-99", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 12.9471, lng: 77.6258, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-100", name: "Dr. Mohan\u2019s Diabetes Specialities Centre", type: "Private", lat: 13.0081, lng: 77.6163, beds: 90, icuBeds: 10, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 253 972" },
    { id: "h-wiki-101", name: "Indira Gandhi Institute of Child Health, Bangalore", type: "Private", lat: 12.9895, lng: 77.5533, beds: 127, icuBeds: 19, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 159 709" },
    { id: "h-wiki-102", name: "Kidwai Memorial Institute of Oncology", type: "Private", lat: 12.926, lng: 77.5815, beds: 218, icuBeds: 37, erReady: true, specialties: ["Oncology", "Radiotherapy", "Cancer Surgery"], phone: "+91 99887 146 475" },
    { id: "h-wiki-103", name: "Medicover Hospital", type: "Private", lat: 12.9642, lng: 77.6438, beds: 211, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 322" },
    { id: "h-wiki-104", name: "Minto Eye Hospital, Bangalore Medical College", type: "Government", lat: 13.0236, lng: 77.5957, beds: 321, icuBeds: 37, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 153 859" },
    { id: "h-wiki-105", name: "Narayana Hrudayalaya, Hosur Road", type: "Private", lat: 12.9657, lng: 77.5408, beds: 177, icuBeds: 24, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 139 143" },
    { id: "h-wiki-106", name: "National Institute of Mental Health and Neurosciences (Nimhans), Bangalore", type: "Government", lat: 12.9171, lng: 77.6078, beds: 187, icuBeds: 29, erReady: true, specialties: ["Psychiatry", "Behavioral Sciences", "Neurology"], phone: "+91 99887 189 570" },
    { id: "h-wiki-107", name: "Rajarajeswari Medical College and Hospital", type: "Government", lat: 12.9925, lng: 77.6488, beds: 145, icuBeds: 15, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 152 091" },
    { id: "h-wiki-108", name: "SDS Tuberculosis and Rajiv Gandhi Institute of Chest diseases", type: "Private", lat: 13.0244, lng: 77.566, beds: 274, icuBeds: 36, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 174 230" },
    { id: "h-wiki-109", name: "Sri Jayadeva Institute of Cardiology, Jayanagar", type: "Private", lat: 12.9354, lng: 77.5445, beds: 101, icuBeds: 13, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 157 720" },
    { id: "h-wiki-110", name: "St. Johns Medical College", type: "Government", lat: 12.9252, lng: 77.6382, beds: 304, icuBeds: 40, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 129 133" },
    { id: "h-wiki-111", name: "Sukoon Health, Poornapura", type: "Private", lat: 13.0222, lng: 77.6361, beds: 249, icuBeds: 19, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 131 304" },
    { id: "h-wiki-112", name: "Vanivilas Women and Children Hospital, Bangalore Medical College", type: "Government", lat: 13.0071, lng: 77.5377, beds: 62, icuBeds: 9, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 177 636" },
    { id: "h-wiki-113", name: "Victoria Hospital, Bangalore Medical College", type: "Government", lat: 12.9091, lng: 77.5661, beds: 206, icuBeds: 26, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 153 742" },
    { id: "h-wiki-114", name: "Vydehi Institute of Medical Sciences and Research Centre Whitefield, Bangalore", type: "Government", lat: 12.9509, lng: 77.6618, beds: 116, icuBeds: 20, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 194 848" },
    { id: "h-wiki-115", name: "Sri Jayadeva Institute of Cardiology, Sedam road", type: "Private", lat: 17.3443, lng: 76.8324, beds: 113, icuBeds: 9, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 158 162" },
    { id: "h-wiki-116", name: "All India Institute of Speech and Hearing (AIISH), Manasagangotri", type: "Private", lat: 12.3107, lng: 76.6375, beds: 95, icuBeds: 14, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 174 828" },
    { id: "h-wiki-117", name: "Cheluvamba Hospital", type: "Private", lat: 12.2904, lng: 76.6189, beds: 111, icuBeds: 13, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 124 492" },
    { id: "h-wiki-118", name: "Columbia Asia, Belvadi", type: "Private", lat: 12.2717, lng: 76.6492, beds: 170, icuBeds: 14, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 125 961" },
    { id: "h-wiki-119", name: "Krishna Rajendra Hospital", type: "Private", lat: 12.3106, lng: 76.6655, beds: 258, icuBeds: 26, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 131 551" },
    { id: "h-wiki-120", name: "Motherhood Hospital", type: "Private", lat: 12.3226, lng: 76.6192, beds: 168, icuBeds: 14, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 124 921" },
    { id: "h-wiki-121", name: "Narayana Multispeciality Hospital", type: "Private", lat: 12.2701, lng: 76.6132, beds: 321, icuBeds: 26, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 143 069" },
    { id: "h-wiki-122", name: "A J Institute of Medical Science", type: "Private", lat: 12.929, lng: 74.8541, beds: 297, icuBeds: 43, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 137 258" },
    { id: "h-wiki-123", name: "KMC Hospital, Mangalore", type: "Private", lat: 12.9087, lng: 74.8355, beds: 292, icuBeds: 28, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 127 053" },
    { id: "h-wiki-124", name: "Wenlock District Hospital", type: "Government", lat: 12.89, lng: 74.8658, beds: 72, icuBeds: 8, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 131 993" },
    { id: "h-wiki-125", name: "Kasturba Medical College", type: "Government", lat: 15.3322, lng: 75.712, beds: 280, icuBeds: 38, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 129 627" },
    { id: "h-wiki-126", name: "Government T D Medical College, Alappuzha", type: "Government", lat: 9.513, lng: 76.3369, beds: 263, icuBeds: 44, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 148 581" },
    { id: "h-wiki-127", name: "Aster MIMS", type: "Private", lat: 11.2737, lng: 75.7785, beds: 257, icuBeds: 28, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 111 089" },
    { id: "h-wiki-128", name: "Chest Hospital", type: "Private", lat: 11.2534, lng: 75.7599, beds: 260, icuBeds: 29, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 117 823" },
    { id: "h-wiki-129", name: "Matria Hospital", type: "Private", lat: 11.2347, lng: 75.7902, beds: 78, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 162" },
    { id: "h-wiki-130", name: "Government Medical College, Kozhikode", type: "Government", lat: 11.2736, lng: 75.8065, beds: 342, icuBeds: 44, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 145 799" },
    { id: "h-wiki-131", name: "Medical College Hospital", type: "Government", lat: 11.2856, lng: 75.7602, beds: 245, icuBeds: 42, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 129 718" },
    { id: "h-wiki-132", name: "Amrita Institute of Medical Sciences", type: "Government", lat: 9.9461, lng: 76.2654, beds: 72, icuBeds: 10, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 144 408" },
    { id: "h-wiki-133", name: "Apollo Adlux Hospital", type: "Private", lat: 9.9258, lng: 76.2468, beds: 335, icuBeds: 29, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 126 325" },
    { id: "h-wiki-134", name: "Aster Medcity", type: "Private", lat: 9.9071, lng: 76.2771, beds: 148, icuBeds: 16, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 116 406" },
    { id: "h-wiki-135", name: "General Hospital, Ernakulam", type: "Government", lat: 9.946, lng: 76.2934, beds: 69, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 133 462" },
    { id: "h-wiki-136", name: "Indira Gandhi Cooperative Hospital", type: "Private", lat: 9.958, lng: 76.2471, beds: 297, icuBeds: 32, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 142 523" },
    { id: "h-wiki-137", name: "Lakeshore Hospital", type: "Private", lat: 9.9055, lng: 76.2411, beds: 211, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 322" },
    { id: "h-wiki-138", name: "Lisie Hospital", type: "Private", lat: 9.9067, lng: 76.2985, beds: 182, icuBeds: 32, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 117 810" },
    { id: "h-wiki-139", name: "Little Flower Hospital", type: "Private", lat: 9.9677, lng: 76.289, beds: 243, icuBeds: 37, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 127 885" },
    { id: "h-wiki-140", name: "Medical Trust Hospital", type: "Government", lat: 9.9491, lng: 76.226, beds: 71, icuBeds: 7, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 127 729" },
    { id: "h-wiki-141", name: "Meditrina Hospital", type: "Private", lat: 9.8856, lng: 76.2542, beds: 63, icuBeds: 8, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 123 309" },
    { id: "h-wiki-142", name: "Rajagiri Hospital", type: "Private", lat: 9.9238, lng: 76.3165, beds: 224, icuBeds: 39, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 121 801" },
    { id: "h-wiki-143", name: "Renai Medicity", type: "Private", lat: 9.9832, lng: 76.2684, beds: 132, icuBeds: 11, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 117 563" },
    { id: "h-wiki-144", name: "Saraf Hospital", type: "Private", lat: 9.9253, lng: 76.2135, beds: 108, icuBeds: 11, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 117 693" },
    { id: "h-wiki-145", name: "Sunrise Hospital", type: "Private", lat: 9.8767, lng: 76.2805, beds: 222, icuBeds: 34, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 120 969" },
    { id: "h-wiki-146", name: "Azeezia Medical College, Meeyannoor, Kollam", type: "Government", lat: 8.9081, lng: 76.6122, beds: 229, icuBeds: 35, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 151 688" },
    { id: "h-wiki-147", name: "District Hospital, Kollam", type: "Government", lat: 8.8878, lng: 76.5936, beds: 298, icuBeds: 34, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 131 070" },
    { id: "h-wiki-148", name: "Government Medical College, Kollam", type: "Government", lat: 8.8691, lng: 76.6239, beds: 247, icuBeds: 27, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 141 535" },
    { id: "h-wiki-149", name: "Meditrina Hospital, Ayathil", type: "Private", lat: 8.908, lng: 76.6402, beds: 104, icuBeds: 9, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 605" },
    { id: "h-wiki-150", name: "N. S. Memorial Institute of Medical Sciences", type: "Government", lat: 8.92, lng: 76.5939, beds: 333, icuBeds: 33, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 151 337" },
    { id: "h-wiki-151", name: "Travancore Medical College Hospital", type: "Government", lat: 8.8675, lng: 76.5879, beds: 74, icuBeds: 6, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 143 719" },
    { id: "h-wiki-152", name: "Medical College Hospital, Athirampuzha", type: "Government", lat: 9.6065, lng: 76.5203, beds: 214, icuBeds: 18, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 147 112" },
    { id: "h-wiki-153", name: "Divya Prabha Eye Hospital", type: "Private", lat: 8.539, lng: 76.9347, beds: 93, icuBeds: 15, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 186" },
    { id: "h-wiki-154", name: "Government Medical College, Thiruvananthapuram", type: "Government", lat: 8.5187, lng: 76.9161, beds: 311, icuBeds: 52, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 158 617" },
    { id: "h-wiki-155", name: "Mission Hospital, Pothencode", type: "Private", lat: 8.5, lng: 76.9464, beds: 263, icuBeds: 26, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 135 295" },
    { id: "h-wiki-156", name: "Regional Cancer Centre", type: "Government", lat: 8.5389, lng: 76.9627, beds: 70, icuBeds: 6, erReady: true, specialties: ["Oncology", "Radiotherapy", "Cancer Surgery"], phone: "+91 99887 127 014" },
    { id: "h-wiki-157", name: "Sree Chitra Thirunal Institute of Medical Sciences and Technology", type: "Government", lat: 8.5509, lng: 76.9164, beds: 181, icuBeds: 21, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 179 794" },
    { id: "h-wiki-158", name: "Amala Ayurvedic Hospital and Research Centre, Amala Nagar", type: "Private", lat: 10.5425, lng: 76.2125, beds: 224, icuBeds: 21, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 167 782" },
    { id: "h-wiki-159", name: "Amala Institute of Medical Sciences, Amala Nagar", type: "Government", lat: 10.5222, lng: 76.1939, beds: 257, icuBeds: 35, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 156 667" },
    { id: "h-wiki-160", name: "Aswini Hospital, Sastha Nagar", type: "Private", lat: 10.5035, lng: 76.2242, beds: 297, icuBeds: 50, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 135 048" },
    { id: "h-wiki-161", name: "Jubilee Mission Medical College and Research Institute, Thrissur", type: "Government", lat: 10.5424, lng: 76.2405, beds: 150, icuBeds: 19, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 178 689" },
    { id: "h-wiki-162", name: "Daya General Hospital and Specialty Surgical Centre, Thrissur", type: "Government", lat: 10.5544, lng: 76.1942, beds: 260, icuBeds: 24, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 174 633" },
    { id: "h-wiki-163", name: "Shihab Thangal Hospital", type: "Private", lat: 11.0871, lng: 76.0721, beds: 246, icuBeds: 41, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 128 522" },
    { id: "h-wiki-164", name: "Government District Hospital, Perinthalmanna", type: "Government", lat: 11.0668, lng: 76.0535, beds: 109, icuBeds: 17, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 156 329" },
    { id: "h-wiki-165", name: "Government District Hospital, Nilambur", type: "Government", lat: 11.0481, lng: 76.0838, beds: 100, icuBeds: 12, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 148 113" },
    { id: "h-wiki-166", name: "Government Medical College Hospital, Manjeri", type: "Government", lat: 11.087, lng: 76.1001, beds: 338, icuBeds: 51, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 154 145" },
    { id: "h-wiki-167", name: "All India Institute of Medical Sciences, Bhopal", type: "Government", lat: 23.2748, lng: 77.4107, beds: 77, icuBeds: 8, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 155 666" },
    { id: "h-wiki-168", name: "Apollo Sage Hospital, Bhopal", type: "Private", lat: 23.2545, lng: 77.3921, beds: 106, icuBeds: 10, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 133 449" },
    { id: "h-wiki-169", name: "Kamla Nehru Hospital & Gandhi Medical College", type: "Government", lat: 23.2358, lng: 77.4224, beds: 151, icuBeds: 17, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 152 507" },
    { id: "h-wiki-170", name: "Hamidia Hospital", type: "Private", lat: 23.2747, lng: 77.4387, beds: 205, icuBeds: 27, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 120 189" },
    { id: "h-wiki-171", name: "Apollo Hospital", type: "Private", lat: 22.7345, lng: 75.8558, beds: 120, icuBeds: 18, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 279" },
    { id: "h-wiki-172", name: "Bombay Hospital, Indore", type: "Private", lat: 22.7142, lng: 75.8372, beds: 60, icuBeds: 6, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 128 015" },
    { id: "h-wiki-173", name: "CHL Indore", type: "Private", lat: 22.6955, lng: 75.8675, beds: 161, icuBeds: 25, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 111 128" },
    { id: "h-wiki-174", name: "Medanta Hospital", type: "Private", lat: 22.7344, lng: 75.8838, beds: 85, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 358" },
    { id: "h-wiki-175", name: "Shalby Hospital", type: "Private", lat: 22.7464, lng: 75.8375, beds: 75, icuBeds: 11, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 227" },
    { id: "h-wiki-176", name: "Maharaja Yeshwantrao Hospital", type: "Private", lat: 22.6939, lng: 75.8315, beds: 154, icuBeds: 18, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 137 206" },
    { id: "h-wiki-177", name: "Sri Aurobindo Hospital", type: "Private", lat: 22.6951, lng: 75.8889, beds: 71, icuBeds: 7, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 127 729" },
    { id: "h-wiki-178", name: "Netaji Subhash Chandra Bose Medical College, Jabalpur", type: "Government", lat: 22.1909, lng: 79.9281, beds: 81, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 162 946" },
    { id: "h-wiki-179", name: "Shalby Hospital, Jabalpur", type: "Private", lat: 22.1706, lng: 79.9095, beds: 311, icuBeds: 41, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 130 836" },
    { id: "h-wiki-180", name: "Apollo Hospital, Jabalpur", type: "Private", lat: 22.1519, lng: 79.9398, beds: 314, icuBeds: 36, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 130 888" },
    { id: "h-wiki-181", name: "Cancer Hospital & Research Centre", type: "Private", lat: 26.2332, lng: 78.1809, beds: 186, icuBeds: 18, erReady: true, specialties: ["Oncology", "Radiotherapy", "Cancer Surgery"], phone: "+91 99887 139 156" },
    { id: "h-wiki-182", name: "Sahara Hospital", type: "Private", lat: 26.2129, lng: 78.1623, beds: 246, icuBeds: 40, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 118 980" },
    { id: "h-wiki-183", name: "Hedgewar Hospital", type: "Private", lat: 19.8911, lng: 75.3414, beds: 182, icuBeds: 22, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 121 775" },
    { id: "h-wiki-184", name: "MGM Medical College and Hospital, Aurangabad", type: "Government", lat: 19.8708, lng: 75.3228, beds: 310, icuBeds: 35, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 151 428" },
    { id: "h-wiki-185", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 19.2552, lng: 73.1286, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-186", name: "Fortis Hospital, Kalyan", type: "Private", lat: 19.2349, lng: 73.11, beds: 307, icuBeds: 49, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 128 379" },
    { id: "h-wiki-187", name: "Kokilaben Dhirubhai Ambani Hospital,  Four Bungalows, Mumbai.", type: "Private", lat: 19.0909, lng: 72.8758, beds: 105, icuBeds: 17, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 172 319" },
    { id: "h-wiki-188", name: "Acworth Municipal Hospital for Leprosy, Wadala", type: "Government", lat: 19.0706, lng: 72.8572, beds: 215, icuBeds: 20, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 156 693" },
    { id: "h-wiki-189", name: "Asian Heart Institute, Bandra", type: "Private", lat: 19.0519, lng: 72.8875, beds: 166, icuBeds: 20, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 134 905" },
    { id: "h-wiki-190", name: "Bhabha Hospital, Bandra", type: "Private", lat: 19.0908, lng: 72.9038, beds: 76, icuBeds: 8, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 127 222" },
    { id: "h-wiki-191", name: "Bhaktivedanta Hospital, Mira Road", type: "Private", lat: 19.1028, lng: 72.8575, beds: 263, icuBeds: 42, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 140 209" },
    { id: "h-wiki-192", name: "Bombay Hospital, Marine Lines", type: "Private", lat: 19.0503, lng: 72.8515, beds: 68, icuBeds: 6, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 134 957" },
    { id: "h-wiki-193", name: "Breach Candy Hospital, Mahalaxmi", type: "Private", lat: 19.0515, lng: 72.9089, beds: 278, icuBeds: 46, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 138 558" },
    { id: "h-wiki-194", name: "Cooper Hospital, Vile Parle", type: "Private", lat: 19.1125, lng: 72.8994, beds: 277, icuBeds: 25, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 132 396" },
    { id: "h-wiki-195", name: "D Y Patil Hospital, Nerul", type: "Private", lat: 19.0939, lng: 72.8364, beds: 88, icuBeds: 11, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 128 457" },
    { id: "h-wiki-196", name: "Doctor Das Multispecialty Hospital, Chembur", type: "Private", lat: 19.0304, lng: 72.8646, beds: 59, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 153 482" },
    { id: "h-wiki-197", name: "Gokuldas Tejpal Hospital, Fort", type: "Private", lat: 19.0686, lng: 72.9269, beds: 260, icuBeds: 24, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 136 673" },
    { id: "h-wiki-198", name: "Grant Medical College and Sir Jamshedjee Jeejebhoy Group of Hospitals, Sandhurst Road", type: "Government", lat: 19.128, lng: 72.8788, beds: 333, icuBeds: 54, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 202 167" },
    { id: "h-wiki-199", name: "Hinduja Healthcare Surgical, Khar, Mumbai", type: "Private", lat: 19.0701, lng: 72.8239, beds: 307, icuBeds: 50, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 148 763" },
    { id: "h-wiki-200", name: "Hinduja Hospital, Mahim, Mumbai", type: "Private", lat: 19.0215, lng: 72.8909, beds: 251, icuBeds: 40, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 136 686" },
    { id: "h-wiki-201", name: "Holy Family Hospital, Bandra", type: "Private", lat: 19.0969, lng: 72.9319, beds: 121, icuBeds: 14, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 133 566" },
    { id: "h-wiki-202", name: "Hurkisondas Hospital, Girgaon", type: "Private", lat: 19.1288, lng: 72.8491, beds: 87, icuBeds: 14, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 136 634" },
    { id: "h-wiki-203", name: "Jaslok Hospital, Pedar Road", type: "Private", lat: 19.0398, lng: 72.8276, beds: 183, icuBeds: 30, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 132 110" },
    { id: "h-wiki-204", name: "KEM Hospital, Parel", type: "Private", lat: 19.0296, lng: 72.9213, beds: 325, icuBeds: 40, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 121 645" },
    { id: "h-wiki-205", name: "Lilavati Hospital, Bandra", type: "Private", lat: 19.1266, lng: 72.9192, beds: 307, icuBeds: 43, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 130 550" },
    { id: "h-wiki-206", name: "Lokmanya Tilak Hospital, Sion", type: "Private", lat: 19.1115, lng: 72.8208, beds: 277, icuBeds: 39, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 135 282" },
    { id: "h-wiki-207", name: "Mahatma Gandhi Memorial Hospital, Parel", type: "Private", lat: 19.0135, lng: 72.8492, beds: 208, icuBeds: 18, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 146 982" },
    { id: "h-wiki-208", name: "Nanavati Hospital, Vile Parle", type: "Private", lat: 19.0553, lng: 72.9449, beds: 204, icuBeds: 27, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 135 022" },
    { id: "h-wiki-209", name: "Prince Aly Khan Hospital, Byculla", type: "Private", lat: 19.1469, lng: 72.8899, beds: 303, icuBeds: 45, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 139 169" },
    { id: "h-wiki-210", name: "Rajawadi Hospital, Ghatkopar", type: "Private", lat: 19.079, lng: 72.8043, beds: 178, icuBeds: 31, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 134 788" },
    { id: "h-wiki-211", name: "Saifee Hospital, Charni Road", type: "Private", lat: 19.0013, lng: 72.8843, beds: 77, icuBeds: 8, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 176" },
    { id: "h-wiki-212", name: "Shushrusha Citizens' Co", type: "Private", lat: 19.0925, lng: 72.9524, beds: 236, icuBeds: 23, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 128 496" },
    { id: "h-wiki-213", name: "Shushrusha's Suman Ramesh Tulsiani Hospital, Vikhroli", type: "Private", lat: 19.1493, lng: 72.8512, beds: 113, icuBeds: 16, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 165 897" },
    { id: "h-wiki-214", name: "Sunrise Hospital, Bhandup", type: "Private", lat: 19.0396, lng: 72.8072, beds: 311, icuBeds: 45, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 131 135" },
    { id: "h-wiki-215", name: "Tata Memorial Hospital, Parel", type: "Private", lat: 19.0096, lng: 72.9237, beds: 181, icuBeds: 21, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 134 996" },
    { id: "h-wiki-216", name: "Shree Saibaba Heart Institute And Research Centre", type: "Private", lat: 20.0124, lng: 73.7879, beds: 58, icuBeds: 6, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 158 968" },
    { id: "h-wiki-217", name: "Aditya Birla Memorial Hospital", type: "Private", lat: 19.7664, lng: 75.712, beds: 327, icuBeds: 47, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 137 024" },
    { id: "h-wiki-218", name: "Deenanath Mangeshkar Hospital", type: "Private", lat: 18.5353, lng: 73.8548, beds: 180, icuBeds: 15, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 136 777" },
    { id: "h-wiki-219", name: "Hardikar Hospital", type: "Private", lat: 18.515, lng: 73.8362, beds: 227, icuBeds: 20, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 121 762" },
    { id: "h-wiki-220", name: "Jehangir Hospital", type: "Private", lat: 18.4963, lng: 73.8665, beds: 64, icuBeds: 10, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 121 788" },
    { id: "h-wiki-221", name: "Joshi Hospital", type: "Private", lat: 18.5352, lng: 73.8828, beds: 125, icuBeds: 18, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 117 901" },
    { id: "h-wiki-222", name: "Ruby Hall Clinic", type: "Private", lat: 18.5472, lng: 73.8365, beds: 70, icuBeds: 10, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 118 993" },
    { id: "h-wiki-223", name: "Sahyadri Hospital", type: "Private", lat: 18.4947, lng: 73.8305, beds: 341, icuBeds: 52, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 121 957" },
    { id: "h-wiki-224", name: "Sassoon Hospital", type: "Private", lat: 18.4959, lng: 73.8879, beds: 199, icuBeds: 34, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 120 930" },
    { id: "h-wiki-225", name: "embrio ivf centre", type: "Private", lat: 18.5569, lng: 73.8784, beds: 347, icuBeds: 54, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 121 684" },
    { id: "h-wiki-226", name: "All India Institute of Medical Sciences, Nagpur", type: "Government", lat: 21.1607, lng: 79.0863, beds: 244, icuBeds: 23, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 155 965" },
    { id: "h-wiki-227", name: "Government Medical College and Hospital, Nagpur", type: "Government", lat: 21.1404, lng: 79.0677, beds: 253, icuBeds: 35, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 157 395" },
    { id: "h-wiki-228", name: "Indira Gandhi Government Medical College, Nagpur", type: "Government", lat: 21.1217, lng: 79.098, beds: 105, icuBeds: 12, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 157 954" },
    { id: "h-wiki-229", name: "N.K.P. Salve Institute of Medical Sciences Popularly known as Lata Mangeshkar Hospital, Nagpur", type: "Government", lat: 21.1606, lng: 79.1143, beds: 99, icuBeds: 13, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 211 709" },
    { id: "h-wiki-230", name: "Wockhardt Hospital", type: "Private", lat: 21.1726, lng: 79.068, beds: 314, icuBeds: 51, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 439" },
    { id: "h-wiki-231", name: "Currae Hospital", type: "Private", lat: 19.2332, lng: 72.9762, beds: 348, icuBeds: 52, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 214" },
    { id: "h-wiki-232", name: "Chhatrapati Shivaji Maharaj Hospital & Rajiv Gandhi Medical College", type: "Government", lat: 19.2129, lng: 72.9576, beds: 97, icuBeds: 15, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 179 950" },
    { id: "h-wiki-233", name: "Kasturba Hospital, Sewagram", type: "Private", lat: 19.7461, lng: 75.6934, beds: 124, icuBeds: 14, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 133 748" },
    { id: "h-wiki-234", name: "Shri Vasantrao Naik Government Medical College", type: "Government", lat: 19.7274, lng: 75.7237, beds: 188, icuBeds: 15, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 156 459" },
    { id: "h-wiki-235", name: "Jawaharlal Nehru Institute of Medical Sciences", type: "Government", lat: 24.8319, lng: 93.9349, beds: 256, icuBeds: 28, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 156 823" },
    { id: "h-wiki-236", name: "Regional Institute of Medical Sciences", type: "Government", lat: 24.8116, lng: 93.9163, beds: 240, icuBeds: 33, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 147 151" },
    { id: "h-wiki-237", name: "North Eastern Indira Gandhi Regional Institute of Health and Medical Sciences", type: "Government", lat: 25.5937, lng: 91.8812, beds: 233, icuBeds: 38, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 193 015" },
    { id: "h-wiki-238", name: "District Headquarters Hospital, Angul", type: "Private", lat: 20.8593, lng: 85.1503, beds: 313, icuBeds: 54, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 146 462" },
    { id: "h-wiki-239", name: "Pabitra Mohan Pradhan Medical College and Hospital", type: "Government", lat: 20.839, lng: 85.1317, beds: 195, icuBeds: 26, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 160 177" },
    { id: "h-wiki-240", name: "District Headquarters Hospital, Balasore", type: "Private", lat: 21.5091, lng: 86.9298, beds: 114, icuBeds: 19, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 150 440" },
    { id: "h-wiki-241", name: "Fakir Mohan Medical College and Hospital", type: "Government", lat: 21.4888, lng: 86.9112, beds: 227, icuBeds: 28, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 147 853" },
    { id: "h-wiki-242", name: "Bhima Bhoi Medical College and Hospital", type: "Government", lat: 20.7334, lng: 83.4843, beds: 259, icuBeds: 37, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 146 228" },
    { id: "h-wiki-243", name: "District Headquarters Hospital, Bargarh", type: "Private", lat: 20.9666, lng: 85.0966, beds: 164, icuBeds: 14, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 148 958" },
    { id: "h-wiki-244", name: "Pandit Raghunath Murmu Medical College and Hospital", type: "Government", lat: 20.9463, lng: 85.078, beds: 110, icuBeds: 17, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 162 309" },
    { id: "h-wiki-245", name: "City Hospital & District Headquarters Hospital, Cuttack", type: "Private", lat: 19.3299, lng: 84.7922, beds: 233, icuBeds: 31, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 167 197" },
    { id: "h-wiki-246", name: "MKCG Medical College and Hospital", type: "Government", lat: 19.3096, lng: 84.7736, beds: 174, icuBeds: 24, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 138 311" },
    { id: "h-wiki-247", name: "District Headquarters Hospital, Bhadrak", type: "Private", lat: 20.9276, lng: 85.1083, beds: 60, icuBeds: 7, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 148 828" },
    { id: "h-wiki-248", name: "Maa Manikeswari Multispecialty Hospital", type: "Private", lat: 20.9665, lng: 85.1246, beds: 260, icuBeds: 30, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 150 011" },
    { id: "h-wiki-249", name: "Saheed Rendo Majhi Medical College and Hospital", type: "Government", lat: 20.9785, lng: 85.0783, beds: 306, icuBeds: 39, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 155 900" },
    { id: "h-wiki-250", name: "Aditya Ashwini Hospital", type: "Private", lat: 20.311, lng: 85.8226, beds: 186, icuBeds: 21, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 128 951" },
    { id: "h-wiki-251", name: "All India Institute of Medical Sciences, Bhubaneswar", type: "Government", lat: 20.2907, lng: 85.804, beds: 285, icuBeds: 23, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 162 686" },
    { id: "h-wiki-252", name: "Ankura Hospital for Women & Children", type: "Private", lat: 20.272, lng: 85.8343, beds: 272, icuBeds: 47, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 142 874" },
    { id: "h-wiki-253", name: "Apollo Bhubaneswar", type: "Private", lat: 20.3109, lng: 85.8506, beds: 346, icuBeds: 34, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 123 205" },
    { id: "h-wiki-254", name: "CARE Hospitals", type: "Private", lat: 20.3229, lng: 85.8043, beds: 154, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 116 458" },
    { id: "h-wiki-255", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 20.2704, lng: 85.7983, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-256", name: "Institute of Medical Sciences and Sum Hospital", type: "Government", lat: 20.2716, lng: 85.8557, beds: 57, icuBeds: 7, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 156 238" },
    { id: "h-wiki-257", name: "Kalinga Institute of Dental Sciences", type: "Private", lat: 20.3326, lng: 85.8462, beds: 128, icuBeds: 12, erReady: true, specialties: ["Dentistry", "Oral Surgery"], phone: "+91 99887 144 434" },
    { id: "h-wiki-258", name: "Kalinga Institute of Medical Sciences", type: "Government", lat: 20.314, lng: 85.7832, beds: 342, icuBeds: 41, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 145 565" },
    { id: "h-wiki-259", name: "Kalinga Hospital", type: "Private", lat: 20.2505, lng: 85.8114, beds: 349, icuBeds: 59, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 120 319" },
    { id: "h-wiki-260", name: "KIDS Hospital", type: "Private", lat: 20.2887, lng: 85.8737, beds: 163, icuBeds: 19, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 115 171" },
    { id: "h-wiki-261", name: "Kar Clinic & Hospital", type: "Private", lat: 20.3481, lng: 85.8256, beds: 312, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 124 050" },
    { id: "h-wiki-262", name: "Manipal Hospitals", type: "Private", lat: 20.2902, lng: 85.7707, beds: 341, icuBeds: 52, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 121 957" },
    { id: "h-wiki-263", name: "Neelachal Hospital", type: "Private", lat: 20.2416, lng: 85.8377, beds: 95, icuBeds: 15, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 122 893" },
    { id: "h-wiki-264", name: "Shree Hospitals", type: "Private", lat: 20.317, lng: 85.8787, beds: 272, icuBeds: 45, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 318" },
    { id: "h-wiki-265", name: "Sparsh Hospitals & Critical Care", type: "Private", lat: 20.3489, lng: 85.7959, beds: 229, icuBeds: 18, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 138 116" },
    { id: "h-wiki-266", name: "Sunshine Hospital", type: "Private", lat: 20.2599, lng: 85.7744, beds: 235, icuBeds: 39, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 122 269" },
    { id: "h-wiki-267", name: "Utkal Hospital", type: "Private", lat: 20.2497, lng: 85.8681, beds: 342, icuBeds: 51, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 117 953" },
    { id: "h-wiki-268", name: "Vivekanand Hospital", type: "Private", lat: 20.3467, lng: 85.866, beds: 126, icuBeds: 10, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 124 687" },
    { id: "h-wiki-269", name: "District Headquarters Hospital, Boudh", type: "Private", lat: 20.926, lng: 85.0723, beds: 270, icuBeds: 37, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 146 397" },
    { id: "h-wiki-270", name: "Ashwini Hospital", type: "Private", lat: 20.4774, lng: 85.8811, beds: 335, icuBeds: 51, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 683" },
    { id: "h-wiki-271", name: "Shanti Memorial Hospital", type: "Private", lat: 20.4571, lng: 85.8625, beds: 180, icuBeds: 27, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 130 381" },
    { id: "h-wiki-272", name: "Srirama Chandra Bhanja Medical College and Hospital", type: "Government", lat: 20.4384, lng: 85.8928, beds: 53, icuBeds: 9, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 161 217" },
    { id: "h-wiki-273", name: "Sun Hospital", type: "Private", lat: 20.4773, lng: 85.9091, beds: 302, icuBeds: 34, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 115 314" },
    { id: "h-wiki-274", name: "District Headquarters Hospital, Deogarh", type: "Private", lat: 20.9272, lng: 85.1297, beds: 190, icuBeds: 32, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 148 997" },
    { id: "h-wiki-275", name: "District Headquarters Hospital, Dhenkanal", type: "Private", lat: 20.9882, lng: 85.1202, beds: 222, icuBeds: 24, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 151 649" },
    { id: "h-wiki-276", name: "District Headquarters Hospital, Paralakhemundi", type: "Private", lat: 20.9696, lng: 85.0572, beds: 227, icuBeds: 38, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 158 721" },
    { id: "h-wiki-277", name: "Serango Christian Hospital", type: "Private", lat: 20.9061, lng: 85.0854, beds: 77, icuBeds: 8, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 176" },
    { id: "h-wiki-278", name: "District Headquarters Hospital, Jagatsinghpur", type: "Private", lat: 20.9443, lng: 85.1477, beds: 271, icuBeds: 48, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 157 694" },
    { id: "h-wiki-279", name: "District Headquarters Hospital, Jajpur", type: "Private", lat: 21.0037, lng: 85.0996, beds: 238, icuBeds: 20, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 147 983" },
    { id: "h-wiki-280", name: "Jajati Keshri Medical College and Hospital, Jajpur", type: "Government", lat: 20.9458, lng: 85.0447, beds: 102, icuBeds: 18, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 159 722" },
    { id: "h-wiki-281", name: "District Headquarters Hospital, Phulbani", type: "Private", lat: 20.8972, lng: 85.1117, beds: 303, icuBeds: 45, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 150 570" },
    { id: "h-wiki-282", name: "District Headquarters Hospital, Kendrapada", type: "Private", lat: 20.9726, lng: 85.1527, beds: 96, icuBeds: 11, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 152 962" },
    { id: "h-wiki-283", name: "District Headquarters Hospital, Keonjhar", type: "Private", lat: 21.0045, lng: 85.0699, beds: 124, icuBeds: 14, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 150 557" },
    { id: "h-wiki-284", name: "Dharanidhar Medical College and Hospital", type: "Government", lat: 20.9155, lng: 85.0484, beds: 237, icuBeds: 24, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 148 971" },
    { id: "h-wiki-285", name: "District Headquarters Hospital, Khordha", type: "Private", lat: 20.9053, lng: 85.1421, beds: 346, icuBeds: 42, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 149 088" },
    { id: "h-wiki-286", name: "District Headquarters Hospital, Koraput", type: "Private", lat: 18.829, lng: 82.7103, beds: 81, icuBeds: 7, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 149 569" },
    { id: "h-wiki-287", name: "Saheed Laxman Nayak Medical College and Hospital", type: "Government", lat: 18.8087, lng: 82.6917, beds: 298, icuBeds: 28, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 157 408" },
    { id: "h-wiki-288", name: "District Headquarters Hospital, Malkangiri", type: "Private", lat: 21.0023, lng: 85.14, beds: 206, icuBeds: 25, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 153 222" },
    { id: "h-wiki-289", name: "Christian Hospital, Nabarangpur", type: "Private", lat: 20.9872, lng: 85.0416, beds: 106, icuBeds: 15, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 139 182" },
    { id: "h-wiki-290", name: "District Headquarters Hospital, Nabarangpur", type: "Private", lat: 20.8892, lng: 85.07, beds: 267, icuBeds: 39, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 154 704" },
    { id: "h-wiki-291", name: "District Headquarters Hospital, Nayagarh", type: "Private", lat: 20.931, lng: 85.1657, beds: 103, icuBeds: 16, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 150 466" },
    { id: "h-wiki-292", name: "District Headquarters Hospital, Nuapada", type: "Private", lat: 21.0226, lng: 85.1107, beds: 190, icuBeds: 32, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 148 997" },
    { id: "h-wiki-293", name: "District Headquarters Hospital, Puri", type: "Private", lat: 20.9547, lng: 85.0251, beds: 190, icuBeds: 23, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 145 331" },
    { id: "h-wiki-294", name: "Shri Jagannath Medical College and Hospital", type: "Government", lat: 20.877, lng: 85.1051, beds: 173, icuBeds: 27, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 152 039" },
    { id: "h-wiki-295", name: "Christian Hospital, Bissam Cuttack", type: "Private", lat: 20.9682, lng: 85.1732, beds: 184, icuBeds: 19, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 142 055" },
    { id: "h-wiki-296", name: "District Headquarters Hospital, Rayagada", type: "Private", lat: 21.025, lng: 85.072, beds: 64, icuBeds: 8, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 150 245" },
    { id: "h-wiki-297", name: "District Headquarters Hospital, Sambalpur", type: "Private", lat: 21.4818, lng: 83.9793, beds: 306, icuBeds: 31, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 152 078" },
    { id: "h-wiki-298", name: "Veer Surendra Sai Institute of Medical Sciences and Research", type: "Government", lat: 21.4615, lng: 83.9607, beds: 198, icuBeds: 24, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 172 553" },
    { id: "h-wiki-299", name: "District Headquarters Hospital, Subarnapur (DHH", type: "Private", lat: 20.9153, lng: 85.028, beds: 134, icuBeds: 22, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 157 382" },
    { id: "h-wiki-300", name: "District Headquarters Hospital, Sundargarh", type: "Private", lat: 20.8853, lng: 85.1445, beds: 255, icuBeds: 32, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 153 430" },
    { id: "h-wiki-301", name: "Government Medical College and Hospital, Sundargarh", type: "Government", lat: 21.0068, lng: 85.1595, beds: 255, icuBeds: 36, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 162 829" },
    { id: "h-wiki-302", name: "Aarupadai Veedu Medical College", type: "Government", lat: 11.9565, lng: 79.8064, beds: 240, icuBeds: 19, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 137 583" },
    { id: "h-wiki-303", name: "Aravind Eye Hospital", type: "Private", lat: 11.9362, lng: 79.7878, beds: 72, icuBeds: 8, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 124 700" },
    { id: "h-wiki-304", name: "Dr. Mohan\u2019s Diabetes Specialities Centre", type: "Private", lat: 11.9175, lng: 79.8181, beds: 90, icuBeds: 10, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 253 972" },
    { id: "h-wiki-305", name: "Jawaharlal Institute of Postgraduate Medical Education and Research", type: "Private", lat: 11.9564, lng: 79.8344, beds: 104, icuBeds: 17, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 183 447" },
    { id: "h-wiki-306", name: "Mahatma Gandhi Medical College and Research Institute, Pillaiyarkuppam", type: "Government", lat: 11.9684, lng: 79.7881, beds: 293, icuBeds: 28, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 186 008" },
    { id: "h-wiki-307", name: "Pondicherry Institute of Medical Sciences, Kalapet", type: "Government", lat: 11.9159, lng: 79.7821, beds: 278, icuBeds: 24, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 161 763" },
    { id: "h-wiki-308", name: "Rajiv Gandhi Government Women And Children's Hospital", type: "Government", lat: 11.9171, lng: 79.8395, beds: 190, icuBeds: 17, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 164 220" },
    { id: "h-wiki-309", name: "Sri Venkateshwaraa Medical College Hospital and Research Centre", type: "Government", lat: 11.9781, lng: 79.83, beds: 71, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 177 194" },
    { id: "h-wiki-310", name: "Vinayaka Missions Medical College", type: "Government", lat: 11.9595, lng: 79.767, beds: 59, icuBeds: 10, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 141 015" },
    { id: "h-wiki-311", name: "Rama Sofat Hospital", type: "Private", lat: 30.9159, lng: 75.8554, beds: 211, icuBeds: 25, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 322" },
    { id: "h-wiki-312", name: "Fortis Hospital", type: "Private", lat: 30.7119, lng: 76.7205, beds: 232, icuBeds: 29, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 487" },
    { id: "h-wiki-313", name: "Motherhood Hospital", type: "Private", lat: 30.6916, lng: 76.7019, beds: 168, icuBeds: 14, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 124 921" },
    { id: "h-wiki-314", name: "Shalby Hospital", type: "Private", lat: 30.6729, lng: 76.7322, beds: 75, icuBeds: 11, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 227" },
    { id: "h-wiki-315", name: "Adyar Cancer Institute", type: "Private", lat: 13.0976, lng: 80.2688, beds: 270, icuBeds: 33, erReady: true, specialties: ["Oncology", "Radiotherapy", "Cancer Surgery"], phone: "+91 99887 127 534" },
    { id: "h-wiki-316", name: "Apollo Hospital, Greams Road", type: "Private", lat: 13.0773, lng: 80.2502, beds: 339, icuBeds: 54, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 133 644" },
    { id: "h-wiki-317", name: "Balaji Dental and Craniofacial Hospital", type: "Private", lat: 13.0586, lng: 80.2805, beds: 258, icuBeds: 32, erReady: true, specialties: ["Dentistry", "Oral Surgery"], phone: "+91 99887 147 606" },
    { id: "h-wiki-318", name: "Billroth Hospitals", type: "Private", lat: 13.0975, lng: 80.2968, beds: 79, icuBeds: 7, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 123 595" },
    { id: "h-wiki-319", name: "Dr. Mehta's Hospitals", type: "Private", lat: 13.1095, lng: 80.2505, beds: 207, icuBeds: 31, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 124 596" },
    { id: "h-wiki-320", name: "Dr. Mohan\u2019s Diabetes Specialities Centre", type: "Private", lat: 13.057, lng: 80.2445, beds: 90, icuBeds: 10, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 253 972" },
    { id: "h-wiki-321", name: "Fortis Malar Hospital", type: "Private", lat: 13.0582, lng: 80.3019, beds: 290, icuBeds: 28, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 126 312" },
    { id: "h-wiki-322", name: "Global Hospitals & Health City", type: "Private", lat: 13.1192, lng: 80.2924, beds: 177, icuBeds: 16, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 135 321" },
    { id: "h-wiki-323", name: "Government General Hospital", type: "Government", lat: 13.1006, lng: 80.2294, beds: 221, icuBeds: 20, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 134 619" },
    { id: "h-wiki-324", name: "Government Hospital of Thoracic Medicine", type: "Government", lat: 13.0371, lng: 80.2576, beds: 110, icuBeds: 16, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 150 037" },
    { id: "h-wiki-325", name: "Government Institute of Rehabilitation Medicine", type: "Government", lat: 13.0753, lng: 80.3199, beds: 171, icuBeds: 14, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 160 112" },
    { id: "h-wiki-326", name: "Government Royapettah Hospital", type: "Government", lat: 13.1347, lng: 80.2718, beds: 268, icuBeds: 26, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 139 234" },
    { id: "h-wiki-327", name: "Hindu Mission Hospital", type: "Private", lat: 13.0768, lng: 80.2169, beds: 143, icuBeds: 22, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 127 846" },
    { id: "h-wiki-328", name: "Kilpauk Medical College Hospital", type: "Government", lat: 13.0282, lng: 80.2839, beds: 73, icuBeds: 7, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 139 507" },
    { id: "h-wiki-329", name: "Madras Medical Mission", type: "Private", lat: 13.1036, lng: 80.3249, beds: 245, icuBeds: 40, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 127 157" },
    { id: "h-wiki-330", name: "Mehta Multispeciality Hospitals India Pvt. Ltd.", type: "Private", lat: 13.1355, lng: 80.2421, beds: 110, icuBeds: 17, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 157 083" },
    { id: "h-wiki-331", name: "MIOT Hospital", type: "Private", lat: 13.0465, lng: 80.2206, beds: 235, icuBeds: 20, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 115 353" },
    { id: "h-wiki-332", name: "Motherhood Hospital", type: "Private", lat: 13.0363, lng: 80.3143, beds: 168, icuBeds: 14, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 124 921" },
    { id: "h-wiki-333", name: "National Institute of Siddha", type: "Private", lat: 13.1333, lng: 80.3122, beds: 68, icuBeds: 6, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 134 957" },
    { id: "h-wiki-334", name: "Regional Institute of Ophthalmology and Government Ophthalmic Hospital", type: "Government", lat: 13.1182, lng: 80.2138, beds: 98, icuBeds: 8, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 188 959" },
    { id: "h-wiki-335", name: "Sankara Nethralaya", type: "Private", lat: 13.0202, lng: 80.2422, beds: 224, icuBeds: 27, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 010" },
    { id: "h-wiki-336", name: "Southern Railway Headquarters Hospital, Chennai", type: "Government", lat: 13.062, lng: 80.3379, beds: 189, icuBeds: 28, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 159 072" },
    { id: "h-wiki-337", name: "Sir Ivan Stedeford Hospital", type: "Private", lat: 13.1536, lng: 80.2829, beds: 278, icuBeds: 45, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 280" },
    { id: "h-wiki-338", name: "Sri Ramachandra Medical College and Research Institute", type: "Government", lat: 13.0857, lng: 80.1973, beds: 132, icuBeds: 19, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 165 975" },
    { id: "h-wiki-339", name: "Stanley Medical College and Hospital", type: "Government", lat: 13.008, lng: 80.2773, beds: 248, icuBeds: 33, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 144 109" },
    { id: "h-wiki-340", name: "Sundaram Medical Foundation (SMF Hospital), Anna Nagar", type: "Private", lat: 13.0992, lng: 80.3454, beds: 296, icuBeds: 50, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 162 595" },
    { id: "h-wiki-341", name: "Tamil Nadu Government Dental College and Hospital", type: "Government", lat: 13.156, lng: 80.2442, beds: 336, icuBeds: 45, erReady: true, specialties: ["Dentistry", "Oral Surgery"], phone: "+91 99887 159 670" },
    { id: "h-wiki-342", name: "Tamil Nadu Government Multi Super Speciality Hospital", type: "Government", lat: 13.0463, lng: 80.2002, beds: 153, icuBeds: 22, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 166 053" },
    { id: "h-wiki-343", name: "Voluntary Health Services", type: "Private", lat: 13.0163, lng: 80.3167, beds: 146, icuBeds: 22, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 132 214" },
    { id: "h-wiki-344", name: "Aravind Eye Hospital", type: "Private", lat: 11.0317, lng: 76.9539, beds: 72, icuBeds: 8, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 124 700" },
    { id: "h-wiki-345", name: "PSG Institute of Medical Sciences & Research", type: "Government", lat: 11.0114, lng: 76.9353, beds: 128, icuBeds: 18, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 151 467" },
    { id: "h-wiki-346", name: "Sankara Eye Foundation", type: "Private", lat: 10.9927, lng: 76.9656, beds: 66, icuBeds: 9, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 127 391" },
    { id: "h-wiki-347", name: "Sri Ramakrishna Hospital", type: "Private", lat: 11.0316, lng: 76.9819, beds: 90, icuBeds: 12, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 130 407" },
    { id: "h-wiki-348", name: "All India Institute of Medical Sciences, Madurai", type: "Government", lat: 9.9401, lng: 78.1179, beds: 110, icuBeds: 17, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 157 083" },
    { id: "h-wiki-349", name: "Apollo Hospitals", type: "Private", lat: 9.9198, lng: 78.0993, beds: 290, icuBeds: 35, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 774" },
    { id: "h-wiki-350", name: "Christian Medical College & Hospital", type: "Government", lat: 12.9314, lng: 79.1306, beds: 69, icuBeds: 10, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 143 173" },
    { id: "h-wiki-351", name: "Dr. Mohan\u2019s Diabetes Specialities Centre, Katpadi", type: "Private", lat: 12.9111, lng: 79.112, beds: 89, icuBeds: 14, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 264 086" },
    { id: "h-wiki-352", name: "Government Vellore Medical College Hospital", type: "Government", lat: 12.8924, lng: 79.1423, beds: 93, icuBeds: 11, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 153 820" },
    { id: "h-wiki-353", name: "Sri Narayani Hospital & Research Centre Melvisharam", type: "Private", lat: 12.9313, lng: 79.1586, beds: 238, icuBeds: 21, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 161 802" },
    { id: "h-wiki-354", name: "Divisional Railway Hospital, Golden Rock", type: "Government", lat: 11.142, lng: 78.655, beds: 166, icuBeds: 27, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 149 127" },
    { id: "h-wiki-355", name: "Adiparasakthi Hospital", type: "Private", lat: 8.7288, lng: 77.7548, beds: 58, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 128 626" },
    { id: "h-wiki-356", name: "Krishna Hospital", type: "Private", lat: 8.7085, lng: 77.7362, beds: 125, icuBeds: 10, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 120 644" },
    { id: "h-wiki-357", name: "Shifa Hospital", type: "Private", lat: 8.6898, lng: 77.7665, beds: 291, icuBeds: 30, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 117 667" },
    { id: "h-wiki-358", name: "Catherine Booth Hospital", type: "Private", lat: 11.1217, lng: 78.6364, beds: 253, icuBeds: 21, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 130 199" },
    { id: "h-wiki-359", name: "Dr. Jeyasekharan Hospital & Nursing Home", type: "Private", lat: 11.103, lng: 78.6667, beds: 237, icuBeds: 22, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 147 255" },
    { id: "h-wiki-360", name: "Little Flower Hospital", type: "Private", lat: 11.1419, lng: 78.683, beds: 243, icuBeds: 37, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 127 885" },
    { id: "h-wiki-361", name: "Dr. Agarwal's Eye Hospital", type: "Private", lat: 17.3999, lng: 78.4848, beds: 281, icuBeds: 44, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 130 004" },
    { id: "h-wiki-362", name: "Dr. Mohan\u2019s Diabetes Specialities Centre, Domalguda & Jubilee Hills", type: "Private", lat: 17.3796, lng: 78.4662, beds: 340, icuBeds: 35, erReady: true, specialties: ["Diabetes", "Endocrinology", "Internal Medicine"], phone: "+91 99887 284 288" },
    { id: "h-wiki-363", name: "Durgabai Deshmukh Hospital, Vidyanagar", type: "Private", lat: 17.3609, lng: 78.4965, beds: 302, icuBeds: 45, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 147 190" },
    { id: "h-wiki-364", name: "Fernandez Hospital, Boggulkunta", type: "Private", lat: 17.3998, lng: 78.5128, beds: 123, icuBeds: 17, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 139 312" },
    { id: "h-wiki-365", name: "Krishna Institute of Medical Sciences", type: "Government", lat: 17.4118, lng: 78.4665, beds: 309, icuBeds: 51, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 145 890" },
    { id: "h-wiki-366", name: "L. V. Prasad Eye Institute", type: "Private", lat: 17.3593, lng: 78.4605, beds: 118, icuBeds: 19, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 129 185" },
    { id: "h-wiki-367", name: "LifeSpring Hospitals", type: "Private", lat: 17.3605, lng: 78.5179, beds: 296, icuBeds: 36, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 125 922" },
    { id: "h-wiki-368", name: "Medicover Hospitals", type: "Private", lat: 17.4215, lng: 78.5084, beds: 187, icuBeds: 17, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 124 817" },
    { id: "h-wiki-369", name: "National Institute of Mentally Handicapped, New Bowenpally", type: "Private", lat: 17.4029, lng: 78.4454, beds: 69, icuBeds: 6, erReady: true, specialties: ["Psychiatry", "Behavioral Sciences", "Neurology"], phone: "+91 99887 171 942" },
    { id: "h-wiki-370", name: "Nizam's Institute of Medical Sciences, Somajiguda", type: "Government", lat: 17.3394, lng: 78.4736, beds: 189, icuBeds: 16, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 159 527" },
    { id: "h-wiki-371", name: "Osmania General Hospital, Afzal Gunj", type: "Government", lat: 17.3776, lng: 78.5359, beds: 165, icuBeds: 15, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 143 160" },
    { id: "h-wiki-372", name: "Sarojini Devi Eye Hospital, Mehidipatnam", type: "Private", lat: 17.437, lng: 78.4878, beds: 267, icuBeds: 38, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 148 815" },
    { id: "h-wiki-373", name: "Yashoda Hospitals", type: "Private", lat: 17.3791, lng: 78.4329, beds: 64, icuBeds: 9, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 122 048" },
    { id: "h-wiki-374", name: "Care Hospitals", type: "Private", lat: 17.3305, lng: 78.4999, beds: 76, icuBeds: 11, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 117 706" },
    { id: "h-wiki-375", name: "Rainbow Hospitals", type: "Private", lat: 17.4059, lng: 78.5409, beds: 98, icuBeds: 16, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 122 165" },
    { id: "h-wiki-376", name: "Durru Shehvar Children's & General Hospital", type: "Government", lat: 17.4378, lng: 78.4581, beds: 183, icuBeds: 28, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 151 350" },
    { id: "h-wiki-377", name: "Apollo Hospitals", type: "Private", lat: 17.3488, lng: 78.4366, beds: 290, icuBeds: 35, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 774" },
    { id: "h-wiki-378", name: "Gleneagles Global Hospitals", type: "Private", lat: 17.3386, lng: 78.5303, beds: 62, icuBeds: 6, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 134 099" },
    { id: "h-wiki-379", name: "Continental Hospital, Gachibowli Nanakramguda.", type: "Private", lat: 17.4356, lng: 78.5282, beds: 298, icuBeds: 28, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 157 408" },
    { id: "h-wiki-380", name: "K K Reddy Hospital,", type: "Private", lat: 17.4205, lng: 78.4298, beds: 75, icuBeds: 13, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 121 190" },
    { id: "h-wiki-381", name: "Sai Neha Hospital", type: "Private", lat: 17.3225, lng: 78.4582, beds: 205, icuBeds: 31, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 120 345" },
    { id: "h-wiki-382", name: "Lakshmi Hospital & Research Centre, Himayat Nagar", type: "Private", lat: 17.3643, lng: 78.5539, beds: 211, icuBeds: 26, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 157 863" },
    { id: "h-wiki-383", name: "Cloudnine Hospital, Gachibowli.", type: "Private", lat: 17.4559, lng: 78.4989, beds: 155, icuBeds: 18, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 138 168" },
    { id: "h-wiki-384", name: "Mahatma Gandhi Memorial Hospital", type: "Private", lat: 17.9838, lng: 79.5922, beds: 122, icuBeds: 10, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 139 494" },
    { id: "h-wiki-385", name: "Government General Hospital, Nizamabad", type: "Government", lat: 18.1273, lng: 79.0174, beds: 230, icuBeds: 28, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 147 346" },
    { id: "h-wiki-386", name: "Agartala Government Medical College", type: "Government", lat: 23.8464, lng: 91.2849, beds: 305, icuBeds: 53, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 143 420" },
    { id: "h-wiki-387", name: "Tripura Medical College & Dr. B.R. Ambedkar Memorial Teaching Hospital", type: "Government", lat: 23.8261, lng: 91.2663, beds: 131, icuBeds: 20, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 180 275" },
    { id: "h-wiki-388", name: "District Hospital, Agra", type: "Government", lat: 27.1916, lng: 78.0062, beds: 308, icuBeds: 27, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 128 093" },
    { id: "h-wiki-389", name: "Institute of Mental Health and Hospital", type: "Private", lat: 27.1713, lng: 77.9876, beds: 341, icuBeds: 54, erReady: true, specialties: ["Psychiatry", "Behavioral Sciences", "Neurology"], phone: "+91 99887 147 996" },
    { id: "h-wiki-390", name: "Sarojini Naidu Medical College and Hospital", type: "Government", lat: 27.1526, lng: 78.0179, beds: 219, icuBeds: 34, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 152 221" },
    { id: "h-wiki-391", name: "Jawaharlal Nehru Medical College, AMU, Aligarh", type: "Government", lat: 27.9123, lng: 78.0861, beds: 100, icuBeds: 17, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 153 118" },
    { id: "h-wiki-392", name: "KK Hospital", type: "Private", lat: 27.892, lng: 78.0675, beds: 251, icuBeds: 36, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 113 234" },
    { id: "h-wiki-393", name: "Manipal Hospital", type: "Private", lat: 28.6841, lng: 77.4519, beds: 297, icuBeds: 27, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 462" },
    { id: "h-wiki-394", name: "Max Super Speciality Hospital, Vaishali", type: "Private", lat: 28.6638, lng: 77.4333, beds: 125, icuBeds: 14, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 148 009" },
    { id: "h-wiki-395", name: "All India Institute of Medical Sciences, Gorakhpur", type: "Government", lat: 26.7755, lng: 83.3712, beds: 238, icuBeds: 33, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 160 203" },
    { id: "h-wiki-396", name: "Baba Raghav Das Medical College", type: "Government", lat: 26.7552, lng: 83.3526, beds: 158, icuBeds: 17, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 135 789" },
    { id: "h-wiki-397", name: "KMC Medical College & Hospital, Maharajganj", type: "Government", lat: 26.7365, lng: 83.3829, beds: 316, icuBeds: 52, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 149 283" },
    { id: "h-wiki-398", name: "Ganesh Shankar Vidyarthi Memorial Medical College", type: "Government", lat: 26.4648, lng: 80.33, beds: 166, icuBeds: 19, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 160 138" },
    { id: "h-wiki-399", name: "Hallet Hospital", type: "Private", lat: 26.4445, lng: 80.3114, beds: 252, icuBeds: 23, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 110" },
    { id: "h-wiki-400", name: "J L Rohatgi Memorial Eye Hospital", type: "Private", lat: 26.4258, lng: 80.3417, beds: 277, icuBeds: 39, erReady: true, specialties: ["Ophthalmology", "Eye Care"], phone: "+91 99887 138 701" },
    { id: "h-wiki-401", name: "Rama Medical College", type: "Government", lat: 26.4647, lng: 80.358, beds: 98, icuBeds: 14, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 123 855" },
    { id: "h-wiki-402", name: "Regency Hospital", type: "Private", lat: 26.4767, lng: 80.3117, beds: 212, icuBeds: 35, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 120 605" },
    { id: "h-wiki-403", name: "King George's Medical University", type: "Private", lat: 26.8616, lng: 80.9443, beds: 111, icuBeds: 18, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 139 273" },
    { id: "h-wiki-404", name: "Mayo Hospital", type: "Private", lat: 26.8413, lng: 80.9257, beds: 110, icuBeds: 16, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 116 562" },
    { id: "h-wiki-405", name: "Medanta Hospital", type: "Private", lat: 26.8226, lng: 80.956, beds: 85, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 358" },
    { id: "h-wiki-406", name: "Shalby Hospital", type: "Private", lat: 26.8615, lng: 80.9723, beds: 75, icuBeds: 11, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 227" },
    { id: "h-wiki-407", name: "Sahara Hospital", type: "Private", lat: 26.8735, lng: 80.926, beds: 246, icuBeds: 40, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 118 980" },
    { id: "h-wiki-408", name: "SGPGI", type: "Government", lat: 26.821, lng: 80.92, beds: 61, icuBeds: 6, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 104 914" },
    { id: "h-wiki-409", name: "Metro Hospital & Heart Institute, Meerut", type: "Private", lat: 28.9994, lng: 77.7045, beds: 341, icuBeds: 54, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 147 996" },
    { id: "h-wiki-410", name: "Teerthanker Mahaveer Medical College & Research Centre", type: "Government", lat: 26.8222, lng: 80.9774, beds: 183, icuBeds: 24, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 164 948" },
    { id: "h-wiki-411", name: "Fortis Hospital", type: "Private", lat: 28.5504, lng: 77.3891, beds: 232, icuBeds: 29, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 487" },
    { id: "h-wiki-412", name: "Jaypee Hospital", type: "Private", lat: 28.5301, lng: 77.3705, beds: 78, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 119 162" },
    { id: "h-wiki-413", name: "Kailash Group of Hospitals", type: "Private", lat: 28.5114, lng: 77.4008, beds: 341, icuBeds: 56, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 132 318" },
    { id: "h-wiki-414", name: "Max Multi Speciality Centre", type: "Private", lat: 28.5503, lng: 77.4171, beds: 308, icuBeds: 35, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 133 397" },
    { id: "h-wiki-415", name: "Metro Hospitals & Heart Institute", type: "Private", lat: 28.5623, lng: 77.3708, beds: 294, icuBeds: 32, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 140 365" },
    { id: "h-wiki-416", name: "Motherhood Hospital", type: "Private", lat: 28.5098, lng: 77.3648, beds: 168, icuBeds: 14, erReady: true, specialties: ["Obstetrics", "Gynaecology", "Pediatrics"], phone: "+91 99887 124 921" },
    { id: "h-wiki-417", name: "Yatharth Hospitals", type: "Private", lat: 28.511, lng: 77.4222, beds: 126, icuBeds: 12, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 123 660" },
    { id: "h-wiki-418", name: "Kamla Nehru Memorial Hospital", type: "Private", lat: 26.8832, lng: 80.9679, beds: 349, icuBeds: 39, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 135 802" },
    { id: "h-wiki-419", name: "Sir Sunderlal Hospital", type: "Private", lat: 25.3325, lng: 82.972, beds: 343, icuBeds: 46, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 127 820" },
    { id: "h-wiki-420", name: "Government Doon Medical College", type: "Government", lat: 30.3314, lng: 78.0303, beds: 312, icuBeds: 43, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 138 259" },
    { id: "h-wiki-421", name: "Kailash Hospital, Dehradun", type: "Private", lat: 30.3111, lng: 78.0117, beds: 345, icuBeds: 29, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 131 928" },
    { id: "h-wiki-422", name: "Max Super Speciality Hospital", type: "Private", lat: 30.2924, lng: 78.042, beds: 325, icuBeds: 51, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 136 400" },
    { id: "h-wiki-423", name: "Shri Mahant Indresh Hospital", type: "Private", lat: 30.3313, lng: 78.0583, beds: 114, icuBeds: 18, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 134 528" },
    { id: "h-wiki-424", name: "All India Institute of Medical Sciences, Rishikesh", type: "Government", lat: 30.0817, lng: 79.0174, beds: 95, icuBeds: 11, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 160 086" },
    { id: "h-wiki-425", name: "Metro Hospital & Heart Institute, Haridwar", type: "Private", lat: 30.0614, lng: 78.9988, beds: 247, icuBeds: 28, erReady: true, specialties: ["Cardiology", "Cardio-Thoracic Surgery"], phone: "+91 99887 150 492" },
    { id: "h-wiki-426", name: "Afghanistan", type: "Private", lat: 23.0017, lng: 87.8531, beds: 67, icuBeds: 7, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 114 612" },
    { id: "h-wiki-427", name: "Armenia", type: "Private", lat: 22.9814, lng: 87.8345, beds: 193, icuBeds: 25, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 109 113" },
    { id: "h-wiki-428", name: "Azerbaijan", type: "Private", lat: 22.9627, lng: 87.8648, beds: 103, icuBeds: 16, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 113 195" },
    { id: "h-wiki-429", name: "Bahrain", type: "Private", lat: 23.0016, lng: 87.8811, beds: 296, icuBeds: 30, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 109 009" },
    { id: "h-wiki-430", name: "Bangladesh", type: "Private", lat: 23.0136, lng: 87.8348, beds: 80, icuBeds: 12, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 113 013" },
    { id: "h-wiki-431", name: "Bhutan", type: "Private", lat: 22.9611, lng: 87.8288, beds: 277, icuBeds: 33, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 107 930" },
    { id: "h-wiki-432", name: "Brunei", type: "Private", lat: 22.9623, lng: 87.8862, beds: 191, icuBeds: 17, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 107 969" },
    { id: "h-wiki-433", name: "Cambodia", type: "Private", lat: 23.0233, lng: 87.8767, beds: 271, icuBeds: 47, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 110 192" },
    { id: "h-wiki-434", name: "China", type: "Private", lat: 23.0047, lng: 87.8137, beds: 321, icuBeds: 47, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 106 279" },
    { id: "h-wiki-435", name: "Cyprus", type: "Private", lat: 22.9412, lng: 87.8419, beds: 343, icuBeds: 58, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 108 398" },
    { id: "h-wiki-436", name: "Egypt", type: "Private", lat: 22.9794, lng: 87.9042, beds: 101, icuBeds: 8, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 106 773" },
    { id: "h-wiki-437", name: "Georgia", type: "Private", lat: 23.0388, lng: 87.8561, beds: 105, icuBeds: 9, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 109 126" },
    { id: "h-wiki-438", name: "India", type: "Private", lat: 22.9809, lng: 87.8012, beds: 121, icuBeds: 11, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 106 305" },
    { id: "h-wiki-439", name: "Indonesia", type: "Private", lat: 22.9323, lng: 87.8682, beds: 75, icuBeds: 9, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 111 986" },
    { id: "h-wiki-440", name: "Israel", type: "Private", lat: 23.0077, lng: 87.9092, beds: 117, icuBeds: 17, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 107 904" },
    { id: "h-wiki-441", name: "Japan", type: "Private", lat: 23.0396, lng: 87.8264, beds: 292, icuBeds: 39, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 106 370" },
    { id: "h-wiki-442", name: "Jordan", type: "Private", lat: 22.9506, lng: 87.8049, beds: 78, icuBeds: 9, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 107 878" },
    { id: "h-wiki-443", name: "Kazakhstan", type: "Private", lat: 22.9404, lng: 87.8986, beds: 206, icuBeds: 20, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 113 520" },
    { id: "h-wiki-444", name: "North Korea", type: "Private", lat: 23.0374, lng: 87.8965, beds: 229, icuBeds: 26, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 113 689" },
    { id: "h-wiki-445", name: "South Korea", type: "Private", lat: 23.0223, lng: 87.7981, beds: 323, icuBeds: 36, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 113 793" },
    { id: "h-wiki-446", name: "Kuwait", type: "Private", lat: 22.9243, lng: 87.8265, beds: 77, icuBeds: 8, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 108 177" },
    { id: "h-wiki-447", name: "Kyrgyzstan", type: "Private", lat: 22.9661, lng: 87.9222, beds: 328, icuBeds: 54, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 114 222" },
    { id: "h-wiki-448", name: "Lebanon", type: "Private", lat: 23.0577, lng: 87.8672, beds: 75, icuBeds: 8, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 109 139" },
    { id: "h-wiki-449", name: "Malaysia", type: "Private", lat: 22.9898, lng: 87.7816, beds: 115, icuBeds: 16, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 110 621" },
    { id: "h-wiki-450", name: "Maldives", type: "Private", lat: 22.9121, lng: 87.8616, beds: 341, icuBeds: 49, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 110 673" },
    { id: "h-wiki-451", name: "Mongolia", type: "Private", lat: 23.0033, lng: 87.9297, beds: 108, icuBeds: 19, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 110 686" },
    { id: "h-wiki-452", name: "Myanmar", type: "Private", lat: 23.0601, lng: 87.8285, beds: 93, icuBeds: 12, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 109 425" },
    { id: "h-wiki-453", name: "Nepal", type: "Private", lat: 22.9504, lng: 87.7845, beds: 281, icuBeds: 33, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 106 448" },
    { id: "h-wiki-454", name: "Palestine", type: "Private", lat: 22.9204, lng: 87.901, beds: 320, icuBeds: 43, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 112 129" },
    { id: "h-wiki-455", name: "Pakistan", type: "Private", lat: 23.0419, lng: 87.916, beds: 232, icuBeds: 37, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 110 751" },
    { id: "h-wiki-456", name: "Philippines", type: "Private", lat: 23.0411, lng: 87.7915, beds: 343, icuBeds: 54, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 115 041" },
    { id: "h-wiki-457", name: "Qatar", type: "Private", lat: 22.9157, lng: 87.8086, beds: 126, icuBeds: 13, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 106 565" },
    { id: "h-wiki-458", name: "Russia", type: "Private", lat: 22.9494, lng: 87.9326, beds: 195, icuBeds: 22, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 108 203" },
    { id: "h-wiki-459", name: "Saudi Arabia", type: "Private", lat: 23.0698, lng: 87.8825, beds: 294, icuBeds: 29, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 114 430" },
    { id: "h-wiki-460", name: "Singapore", type: "Private", lat: 23.0036, lng: 87.7679, beds: 129, icuBeds: 22, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 112 168" },
    { id: "h-wiki-461", name: "Sri Lanka", type: "Private", lat: 22.897, lng: 87.8495, beds: 341, icuBeds: 49, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 110 673" },
    { id: "h-wiki-462", name: "Syria", type: "Private", lat: 22.993, lng: 87.946, beds: 56, icuBeds: 4, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 106 760" },
    { id: "h-wiki-463", name: "Tajikistan", type: "Private", lat: 23.0775, lng: 87.8369, beds: 177, icuBeds: 16, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 113 546" },
    { id: "h-wiki-464", name: "Thailand", type: "Private", lat: 22.9568, lng: 87.7663, beds: 302, icuBeds: 30, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 110 465" },
    { id: "h-wiki-465", name: "Timor", type: "Private", lat: 22.9016, lng: 87.8968, beds: 196, icuBeds: 31, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 106 799" },
    { id: "h-wiki-466", name: "Turkey", type: "Private", lat: 23.0398, lng: 87.9351, beds: 298, icuBeds: 33, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 108 372" },
    { id: "h-wiki-467", name: "Turkmenistan", type: "Private", lat: 23.0603, lng: 87.7913, beds: 178, icuBeds: 26, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 116 705" },
    { id: "h-wiki-468", name: "United Arab Emirates", type: "Private", lat: 22.9133, lng: 87.7896, beds: 207, icuBeds: 24, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 124 453" },
    { id: "h-wiki-469", name: "Uzbekistan", type: "Private", lat: 22.9308, lng: 87.9372, beds: 107, icuBeds: 10, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 113 728" },
    { id: "h-wiki-470", name: "Vietnam", type: "Private", lat: 23.0766, lng: 87.9005, beds: 198, icuBeds: 30, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 109 412" },
    { id: "h-wiki-471", name: "Yemen", type: "Private", lat: 23.0207, lng: 87.7591, beds: 332, icuBeds: 36, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 106 630" },
    { id: "h-wiki-472", name: "Abkhazia", type: "Private", lat: 22.8862, lng: 87.8335, beds: 255, icuBeds: 43, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 110 335" },
    { id: "h-wiki-473", name: "Northern Cyprus", type: "Private", lat: 22.9783, lng: 87.9586, beds: 338, icuBeds: 34, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 119 838" },
    { id: "h-wiki-474", name: "South Ossetia", type: "Private", lat: 23.0917, lng: 87.85, beds: 343, icuBeds: 56, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 116 783" },
    { id: "h-wiki-475", name: "Taiwan", type: "Private", lat: 22.9681, lng: 87.7506, beds: 165, icuBeds: 16, erReady: true, specialties: ["Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 107 956" },
    { id: "h-wiki-476", name: "British Indian Ocean Territory", type: "Private", lat: 22.8847, lng: 87.8873, beds: 127, icuBeds: 18, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 137 466" },
    { id: "h-wiki-477", name: "Christmas Island", type: "Private", lat: 23.0324, lng: 87.9531, beds: 199, icuBeds: 26, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 120 501" },
    { id: "h-wiki-478", name: "Cocos (Keeling) Islands", type: "Private", lat: 23.0791, lng: 87.7966, beds: 235, icuBeds: 35, erReady: true, specialties: ["Orthopedics", "Cardiology", "General Surgery", "General Medicine"], phone: "+91 99887 126 897" },
    { id: "h-wiki-479", name: "Hong Kong", type: "Private", lat: 22.9163, lng: 87.7703, beds: 232, icuBeds: 37, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 110 751" },
    { id: "h-wiki-480", name: "Macau", type: "Private", lat: 22.9112, lng: 87.9366, beds: 240, icuBeds: 26, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 106 331" },
    { id: "h-wiki-481", name: "Category", type: "Private", lat: 23.0783, lng: 87.9201, beds: 104, icuBeds: 15, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 110 790" },
    { id: "h-wiki-482", name: "Asia portal", type: "Private", lat: 23.04, lng: 87.755, beds: 303, icuBeds: 54, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 113 936" },
    { id: "h-wiki-483", name: "Hospitals in India", type: "Private", lat: 22.8799, lng: 87.8147, beds: 311, icuBeds: 49, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 122 295" },
    { id: "h-wiki-484", name: "Lists of hospitals in India", type: "Private", lat: 22.9604, lng: 87.9672, beds: 346, icuBeds: 48, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 133 163" },
    { id: "h-wiki-485", name: "CS1 Hindi", type: "Private", lat: 23.1024, lng: 87.8668, beds: 327, icuBeds: 31, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 109 399" },
    { id: "h-wiki-486", name: "Articles with short description", type: "Private", lat: 22.9836, lng: 87.7379, beds: 320, icuBeds: 37, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 140 443" },
    { id: "h-wiki-487", name: "Lists of coordinates", type: "Private", lat: 22.8701, lng: 87.8734, beds: 108, icuBeds: 16, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 125 779" },
    { id: "h-wiki-488", name: "Geographic coordinate lists", type: "Private", lat: 23.0204, lng: 87.9692, beds: 349, icuBeds: 59, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 135 152" },
    { id: "h-wiki-489", name: "Articles with Geo", type: "Private", lat: 23.0966, lng: 87.8066, beds: 153, icuBeds: 14, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 982" },
    { id: "h-wiki-490", name: "This page was last edited on 9 May 2026, at 07:37\u00a0(UTC).", type: "Private", lat: 22.9242, lng: 87.7515, beds: 173, icuBeds: 17, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 156 589" },
    { id: "h-wiki-491", name: "Privacy policy", type: "Private", lat: 22.8915, lng: 87.931, beds: 159, icuBeds: 20, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 118 486" },
    { id: "h-wiki-492", name: "Disclaimers", type: "Private", lat: 23.0751, lng: 87.9403, beds: 66, icuBeds: 5, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 114 768" },
    { id: "h-wiki-493", name: "Legal & safety contacts", type: "Private", lat: 23.0606, lng: 87.7557, beds: 285, icuBeds: 31, erReady: true, specialties: ["Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 127 742" },
    { id: "h-wiki-494", name: "Code of Conduct", type: "Private", lat: 22.878, lng: 87.7942, beds: 289, icuBeds: 36, erReady: true, specialties: ["Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 117 888" },
    { id: "h-wiki-495", name: "Developers", type: "Private", lat: 22.9402, lng: 87.9715, beds: 349, icuBeds: 60, erReady: true, specialties: ["Trauma Care", "Emergency Care", "Pediatrics", "Neurology"], phone: "+91 99887 113 637" },
    { id: "h-wiki-496", name: "Statistics", type: "Private", lat: 23.1092, lng: 87.8864, beds: 57, icuBeds: 6, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 113 871" },
    { id: "h-wiki-497", name: "Cookie statement", type: "Government", lat: 23.0023, lng: 87.7287, beds: 230, icuBeds: 33, erReady: true, specialties: ["Pediatrics", "Neurology", "Orthopedics", "Cardiology"], phone: "+91 99887 120 995" },
    { id: "h-wiki-498", name: "Mobile view", type: "Private", lat: 22.8586, lng: 87.8559, beds: 273, icuBeds: 22, erReady: true, specialties: ["General Surgery", "General Medicine", "Trauma Care", "Emergency Care"], phone: "+91 99887 113 975" },
    { id: "h-ranchi-1", name: "Sadar Hospital, Ranchi", type: "Government", lat: 23.3441, lng: 85.3096, beds: 200, icuBeds: 20, erReady: true, specialties: ["General Medicine", "Trauma Care", "Emergency Care", "Surgery"], phone: "+91 651 220 2020" },
    { id: "h-jamshedpur-1", name: "Brahmananda Narayana Multispeciality Hospital", type: "Private", lat: 22.8046, lng: 86.2029, beds: 150, icuBeds: 25, erReady: true, specialties: ["Cardiology", "Neurology", "Orthopedics", "General Surgery"], phone: "+91 657 234 5678" }
  ];

  // ── Emergency Types ──
  const EMERGENCY_TYPES = [
    { id: 'accident', label: 'Road Accident', icon: '🚗', priority: 'critical', suggestedType: 'ALS' },
    { id: 'heart_attack', label: 'Heart Attack', icon: '❤️', priority: 'critical', suggestedType: 'ALS' },
    { id: 'stroke', label: 'Stroke', icon: '🧠', priority: 'critical', suggestedType: 'ALS' },
    { id: 'breathing', label: 'Breathing Difficulty', icon: '🫁', priority: 'high', suggestedType: 'ALS' },
    { id: 'pregnancy', label: 'Pregnancy Emergency', icon: '🤰', priority: 'high', suggestedType: 'BLS' },
    { id: 'burn', label: 'Burn Injury', icon: '🔥', priority: 'high', suggestedType: 'ALS' },
    { id: 'fall', label: 'Fall / Fracture', icon: '🦴', priority: 'medium', suggestedType: 'BLS' },
    { id: 'unconscious', label: 'Unconscious Person', icon: '😵', priority: 'critical', suggestedType: 'ALS' },
    { id: 'bleeding', label: 'Severe Bleeding', icon: '🩸', priority: 'critical', suggestedType: 'ALS' },
    { id: 'other', label: 'Other Emergency', icon: '🏥', priority: 'medium', suggestedType: 'BLS' },
  ];

  // ── Storage Keys ──
  const KEYS = {
    user: 'gh_current_user',
    ambulances: 'gh_ambulances',
    hospitals: 'gh_hospitals',
    requests: 'gh_requests',
    activeRequest: 'gh_active_request',
    notifications: 'gh_notifications',
  };

  // ── Helpers ──
  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function load(key, fallback) {
    try {
      const d = localStorage.getItem(key);
      return d ? JSON.parse(d) : fallback;
    } catch { return fallback; }
  }

  function generateId() {
    return 'req-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  }

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Auth ──
  function login(email, password) {
    const allAccounts = [...DEMO_ACCOUNTS, ...load('gh_custom_accounts', [])];
    const user = allAccounts.find(a => a.email === email && a.password === password);
    if (user) {
      const session = { ...user };
      delete session.password;
      save(KEYS.user, session);
      return session;
    }
    return null;
  }

  function signup(userData) {
    const accounts = load('gh_custom_accounts', []);
    const exists = [...DEMO_ACCOUNTS, ...accounts].find(a => a.email === userData.email);
    if (exists) return null;
    const newUser = { id: 'user-' + Date.now(), ...userData };
    accounts.push(newUser);
    save('gh_custom_accounts', accounts);
    const session = { ...newUser };
    delete session.password;
    save(KEYS.user, session);
    return session;
  }

  function logout() {
    localStorage.removeItem(KEYS.user);
  }

  function getCurrentUser() {
    return load(KEYS.user, null);
  }

  // ── Ambulances ──
  function getAmbulances() {
    return load(KEYS.ambulances, [...DEFAULT_AMBULANCES]);
  }

  function saveAmbulances(ambulances) {
    save(KEYS.ambulances, ambulances);
  }

  function updateAmbulance(id, updates) {
    const ambulances = getAmbulances();
    const idx = ambulances.findIndex(a => a.id === id);
    if (idx > -1) {
      // If returning to available, reset coordinates to home hospital
      if (updates.status === 'available' && ambulances[idx].status !== 'available') {
        const hospitals = getHospitals();
        const homeHospital = hospitals.find(h => h.id === ambulances[idx].hospitalId);
        if (homeHospital) {
          updates.lat = homeHospital.lat + (Math.random() - 0.5) * 0.001;
          updates.lng = homeHospital.lng + (Math.random() - 0.5) * 0.001;
        }
      }
      ambulances[idx] = { ...ambulances[idx], ...updates };
      saveAmbulances(ambulances);
      return ambulances[idx];
    }
    return null;
  }

  function getNearestAmbulance(lat, lng, preferredType) {
    const ambulances = getAmbulances().filter(a => a.status === 'available');
    if (ambulances.length === 0) return null;

    let sorted = ambulances.map(a => ({
      ...a,
      distance: haversineDistance(lat, lng, a.lat, a.lng),
    })).sort((a, b) => a.distance - b.distance);

    // Prefer the suggested type if available nearby
    if (preferredType) {
      const preferred = sorted.find(a => a.type === preferredType);
      if (preferred && preferred.distance < sorted[0].distance * 1.5) {
        return preferred;
      }
    }

    return sorted[0];
  }

  // ── Hospitals ──
  function getHospitals() {
    return load(KEYS.hospitals, [...DEFAULT_HOSPITALS]);
  }

  function getNearestHospital(lat, lng, typePreference = 'Any') {
    let hospitals = getHospitals();
    if (typePreference && typePreference !== 'Any') {
      hospitals = hospitals.filter(h => h.type === typePreference);
    }
    if (hospitals.length === 0) {
      hospitals = getHospitals(); // Fallback if no hospital fits preference
    }
    return hospitals.map(h => ({
      ...h,
      distance: haversineDistance(lat, lng, h.lat, h.lng),
    })).sort((a, b) => a.distance - b.distance)[0];
  }

  // ── Requests ──
  function getRequests() {
    return load(KEYS.requests, []);
  }

  function saveRequests(requests) {
    save(KEYS.requests, requests);
  }

  function createRequest(data) {
    const requests = getRequests();
    const newRequest = {
      id: generateId(),
      patientName: data.patientName || 'Unknown',
      patientAge: data.patientAge || '',
      phone: data.phone || '',
      emergencyType: data.emergencyType || 'other',
      numPatients: data.numPatients || 1,
      medicalCondition: data.medicalCondition || '',
      lat: data.lat,
      lng: data.lng,
      address: data.address || 'Location detected via GPS',
      status: 'pending', // pending -> assigned -> en-route -> arriving -> reached -> completed
      assignedAmbulance: null,
      assignedHospital: null,
      hospitalPreference: data.hospitalPreference || 'Government',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      eta: null,
      statusHistory: [{ status: 'pending', time: Date.now() }],
      goldenHourStart: Date.now(),
      doctorAssigned: null,
      preparationStatus: null,
    };

    requests.push(newRequest);
    saveRequests(requests);
    save(KEYS.activeRequest, newRequest.id);
    return newRequest;
  }

  function updateRequest(id, updates) {
    const requests = getRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx > -1) {
      if (updates.status && updates.status !== requests[idx].status) {
        requests[idx].statusHistory = requests[idx].statusHistory || [];
        requests[idx].statusHistory.push({ status: updates.status, time: Date.now() });
      }
      requests[idx] = { ...requests[idx], ...updates, updatedAt: Date.now() };
      saveRequests(requests);
      return requests[idx];
    }
    return null;
  }

  function getActiveRequest() {
    const id = load(KEYS.activeRequest, null);
    if (!id) return null;
    return getRequests().find(r => r.id === id) || null;
  }

  function setActiveRequest(id) {
    save(KEYS.activeRequest, id);
  }

  // ── Assign Nearest Ambulance to Request ──
  function assignNearestToRequest(requestId) {
    const requests = getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return null;

    const preference = req.hospitalPreference || 'Government';
    
    // 1. Locate the nearest hospital of preferred type
    const hospital = getNearestHospital(req.lat, req.lng, preference);
    
    let ambulance = null;
    let etaMinutes = null;

    if (hospital) {
      // 2. Find the nearest available ambulance assigned to this hospital
      const ambulancesAtHospital = getAmbulances().filter(
        a => a.status === 'available' && a.hospitalId === hospital.id
      );

      if (ambulancesAtHospital.length > 0) {
        ambulance = ambulancesAtHospital.map(a => ({
          ...a,
          distance: haversineDistance(req.lat, req.lng, a.lat, a.lng),
        })).sort((a, b) => a.distance - b.distance)[0];
      }
    }

    // 3. Fallback: If no ambulance is available at that specific hospital,
    // search other hospitals of the same type
    if (!ambulance && preference !== 'Any') {
      const preferredHospitals = getHospitals().filter(h => h.type === preference);
      const preferredHospitalIds = preferredHospitals.map(h => h.id);
      const ambulancesAtPreferredHospitals = getAmbulances().filter(
        a => a.status === 'available' && preferredHospitalIds.includes(a.hospitalId)
      );

      if (ambulancesAtPreferredHospitals.length > 0) {
        ambulance = ambulancesAtPreferredHospitals.map(a => ({
          ...a,
          distance: haversineDistance(req.lat, req.lng, a.lat, a.lng),
        })).sort((a, b) => a.distance - b.distance)[0];
      }
    }

    // 4. Fallback 2: absolute nearest available ambulance in the city
    if (!ambulance) {
      const emergencyInfo = EMERGENCY_TYPES.find(e => e.id === req.emergencyType);
      ambulance = getNearestAmbulance(req.lat, req.lng, emergencyInfo?.suggestedType);
    }

    if (!ambulance) return null;

    const finalHospital = hospital || getNearestHospital(req.lat, req.lng);

    const startLat = finalHospital ? finalHospital.lat : ambulance.lat;
    const startLng = finalHospital ? finalHospital.lng : ambulance.lng;

    const distance = haversineDistance(req.lat, req.lng, startLat, startLng);
    etaMinutes = Math.max(3, Math.round((distance / 35) * 60)); // avg 35 km/h in city

    updateRequest(requestId, {
      status: 'assigned',
      assignedAmbulance: ambulance.id,
      assignedHospital: finalHospital?.id || null,
      eta: etaMinutes,
    });

    updateAmbulance(ambulance.id, {
      status: 'en-route',
      lat: startLat,
      lng: startLng
    });

    return { ambulance: { ...ambulance, lat: startLat, lng: startLng }, eta: etaMinutes, hospital: finalHospital };
  }

  // ── Notifications ──
  function addNotification(notification) {
    const notifications = load(KEYS.notifications, []);
    notifications.unshift({
      id: 'notif-' + Date.now(),
      ...notification,
      read: false,
      time: Date.now(),
    });
    save(KEYS.notifications, notifications.slice(0, 50));
  }

  function getNotifications() {
    return load(KEYS.notifications, []);
  }

  // ── Analytics (mock) ──
  function getAnalytics() {
    const requests = getRequests();
    const ambulances = getAmbulances();
    return {
      totalTrips: requests.length + 847,
      avgResponseTime: 8.5,
      activeAmbulances: ambulances.filter(a => a.status !== 'offline').length,
      totalAmbulances: ambulances.length,
      peakHours: [
        { hour: '6 AM', count: 12 }, { hour: '7 AM', count: 18 }, { hour: '8 AM', count: 35 },
        { hour: '9 AM', count: 42 }, { hour: '10 AM', count: 28 }, { hour: '11 AM', count: 22 },
        { hour: '12 PM', count: 25 }, { hour: '1 PM', count: 20 }, { hour: '2 PM', count: 18 },
        { hour: '3 PM', count: 22 }, { hour: '4 PM', count: 30 }, { hour: '5 PM', count: 38 },
        { hour: '6 PM', count: 45 }, { hour: '7 PM', count: 40 }, { hour: '8 PM', count: 32 },
        { hour: '9 PM', count: 25 }, { hour: '10 PM', count: 15 }, { hour: '11 PM', count: 10 },
      ],
      goldenHourSuccess: 87,
      todayTrips: 23,
    };
  }

  function registerDynamicHospitals(hospitalsList) {
    const currentHospitals = getHospitals();
    const currentAmbulances = getAmbulances();
    let updated = false;

    hospitalsList.forEach(h => {
      if (!currentHospitals.some(ch => ch.id === h.id || ch.name === h.name)) {
        currentHospitals.push(h);
        
        // Spawn 1-2 ambulances for this hospital
        const ambCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 ambulances
        for (let i = 0; i < ambCount; i++) {
          const ambId = 'amb-dyn-' + h.id + '-' + i;
          if (!currentAmbulances.some(ca => ca.id === ambId)) {
            const types = ['ALS', 'BLS'];
            const type = types[Math.floor(Math.random() * 2)];
            const vehicleNo = `IND-${Math.floor(Math.random() * 90) + 10}-AM-${Math.floor(Math.random() * 9000) + 1000}`;
            currentAmbulances.push({
              id: ambId,
              hospitalId: h.id,
              vehicleNo: vehicleNo,
              type: type,
              driver: 'Driver ' + (currentAmbulances.length + 1),
              driverPhone: '+91 99887 ' + (Math.floor(Math.random() * 90000) + 10000),
              status: 'available',
              lat: h.lat + (Math.random() - 0.5) * 0.001,
              lng: h.lng + (Math.random() - 0.5) * 0.001,
              speed: 40,
              fuelLevel: 90,
              lastMaintenance: '2026-06-25',
              totalTrips: 10,
              avgResponseTime: 8
            });
          }
        }
        updated = true;
      }
    });

    if (updated) {
      save(KEYS.hospitals, currentHospitals);
      saveAmbulances(currentAmbulances);
    }
  }

  // ── Init ──
  function init() {
    // Merge India-wide hospitals & ambulances if loaded from hospitals-india.js / ambulances-india.js
    const allDefaultHospitals = [...DEFAULT_HOSPITALS];
    if (typeof INDIA_HOSPITALS !== 'undefined' && INDIA_HOSPITALS.length > 0) {
      INDIA_HOSPITALS.forEach(h => {
        if (!allDefaultHospitals.some(existing => existing.id === h.id)) {
          allDefaultHospitals.push(h);
        }
      });
    }

    const allDefaultAmbulances = [...DEFAULT_AMBULANCES];
    if (typeof INDIA_AMBULANCES !== 'undefined' && INDIA_AMBULANCES.length > 0) {
      INDIA_AMBULANCES.forEach(a => {
        if (!allDefaultAmbulances.some(existing => existing.id === a.id)) {
          allDefaultAmbulances.push(a);
        }
      });
    }

    const existingHospitals = load(KEYS.hospitals, []);
    // Schema upgrade check: reload if old data
    if (existingHospitals.length < allDefaultHospitals.length - 10 || !existingHospitals.some(h => h.id === 'h-wiki-498')) {
      save(KEYS.hospitals, allDefaultHospitals);
      saveAmbulances(allDefaultAmbulances);
      localStorage.removeItem(KEYS.activeRequest);
      localStorage.removeItem(KEYS.requests);
    } else {
      if (!localStorage.getItem(KEYS.ambulances)) {
        saveAmbulances(allDefaultAmbulances);
      }
    }
  }

  // ── Reset ──
  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('gh_custom_accounts');
    init();
  }

  // ── Public API ──
  return {
    CENTER_LAT, CENTER_LNG,
    DEMO_ACCOUNTS, EMERGENCY_TYPES,
    init, resetAll,
    login, signup, logout, getCurrentUser,
    getAmbulances, saveAmbulances, updateAmbulance, getNearestAmbulance,
    getHospitals, getNearestHospital,
    registerDynamicHospitals,
    getRequests, createRequest, updateRequest, getActiveRequest, setActiveRequest,
    assignNearestToRequest,
    addNotification, getNotifications,
    getAnalytics,
    haversineDistance,
  };
})();

// Auto-init
GoldenHourData.init();
