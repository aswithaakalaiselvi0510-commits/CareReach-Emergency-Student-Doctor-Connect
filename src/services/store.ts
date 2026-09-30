import {
  User,
  StudentProfile,
  DoctorProfile,
  EmergencyRequest,
  Consultation,
  Message,
  CareGuidance,
  Appointment,
  AppointmentSlot,
  MedicalRecord,
  AuditLog,
  InAppNotification,
  ClinicFacility,
  UserRole,
  DoctorStatus,
  RequestSeverity,
  AppointmentType
} from '../types';
import {
  syncEmergencyRequestToDb,
  syncConsultationToDb,
  syncMessageToDb,
  syncAppointmentToDb,
  syncMedicalRecordToDb,
  syncAuditLogToDb,
  syncDoctorStatusToDb
} from './firebase';
import { sendDoctorMatchedPushNotification } from './fcm';

// Default Demo Coordinates for Campus & Hostel
// Center: College Main Campus
export const CAMPUS_COORDINATES = {
  lat: 12.9716,
  lng: 77.5946,
  address: 'University Campus, Engineering Block 4B, Room 204'
};

const INITIAL_STUDENT: StudentProfile = {
  id: 'student-demo-1',
  name: 'Arjun Sharma',
  email: 'arjun.student@campus.edu',
  phone: '+91 98765 43210',
  role: 'STUDENT',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  createdAt: '2026-09-01T10:00:00.000Z',
  age: 20,
  gender: 'Male',
  college: 'National Institute of Technology',
  hostelName: 'Kaveri Boys Hostel (Block 4B)',
  hostelRoom: 'Room 204',
  coordinates: { ...CAMPUS_COORDINATES },
  emergencyContact: {
    name: 'Ramesh Sharma (Father)',
    relation: 'Father',
    phone: '+91 98450 11223'
  },
  medicalInfo: {
    allergies: ['Penicillin (Moderate rash)', 'Peanuts (Mild)'],
    existingConditions: ['Mild Allergic Rhinitis'],
    currentMedications: ['Cetirizine (as needed)'],
    bloodGroup: 'B+'
  },
  privacySettings: {
    shareRoomNumber: true,
    shareMedicalHistory: true,
    allowLocationTracking: true
  }
};

const INITIAL_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-demo-1',
    name: 'Dr. Priya Venkatesh',
    email: 'dr.priya@carereach.med',
    phone: '+91 94441 55667',
    role: 'DOCTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-08-15T09:00:00.000Z',
    specialization: 'Internal Medicine & Urgent Care',
    qualification: 'MBBS, MD (Internal Medicine) - CMC Vellore',
    licenseNumber: 'MCI-TN-2014-78492',
    verificationStatus: 'VERIFIED',
    status: 'AVAILABLE',
    experienceYears: 12,
    languages: ['English', 'Tamil', 'Hindi'],
    clinicAffiliation: 'Campus Health Centre & City Urgent Care',
    clinicAddress: 'East Gate Health Avenue, 1.2 km from Campus',
    coordinates: {
      lat: 12.9780,
      lng: 77.6010
    },
    rating: 4.9,
    totalReviews: 142,
    estimatedResponseTimeMinutes: 3,
    consultationHours: '24/7 On-Call Emergency & Clinic 9 AM - 6 PM',
    consultationTypes: ['CHAT', 'VOICE', 'VIDEO'],
    isDemo: true
  },
  {
    id: 'doc-demo-2',
    name: 'Dr. Rajesh Kulkarni',
    email: 'dr.rajesh@carereach.med',
    phone: '+91 98860 33445',
    role: 'DOCTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-08-20T11:00:00.000Z',
    specialization: 'Emergency Medicine & Trauma Care',
    qualification: 'MBBS, DNB (Emergency Medicine) - St. John’s Medical',
    licenseNumber: 'KMC-KA-2016-45210',
    verificationStatus: 'VERIFIED',
    status: 'AVAILABLE',
    experienceYears: 9,
    languages: ['English', 'Kannada', 'Hindi'],
    clinicAffiliation: 'Apollo Clinic & Emergency Response Team',
    clinicAddress: 'Hosur Road Junction, 2.1 km from Campus',
    coordinates: {
      lat: 12.9640,
      lng: 77.5850
    },
    rating: 4.8,
    totalReviews: 89,
    estimatedResponseTimeMinutes: 5,
    consultationHours: 'Evening 6 PM - 2 AM & Emergency',
    consultationTypes: ['CHAT', 'VOICE', 'VIDEO'],
    isDemo: true
  },
  {
    id: 'doc-demo-3',
    name: 'Dr. Ananya Roy',
    email: 'dr.ananya@carereach.med',
    phone: '+91 97750 99881',
    role: 'DOCTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-05990f1f1b69?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-08-22T14:00:00.000Z',
    specialization: 'General Practice & Adolescent Health',
    qualification: 'MBBS, MRCGP - Medical College Kolkata',
    licenseNumber: 'WB-MC-2012-99321',
    verificationStatus: 'VERIFIED',
    status: 'BUSY',
    experienceYears: 14,
    languages: ['English', 'Bengali', 'Hindi'],
    clinicAffiliation: 'Student Wellness Pavilion',
    clinicAddress: 'Student Centre Wing C, 0.5 km from Campus',
    coordinates: {
      lat: 12.9730,
      lng: 77.5990
    },
    rating: 4.95,
    totalReviews: 210,
    estimatedResponseTimeMinutes: 12,
    consultationHours: '8 AM - 8 PM',
    consultationTypes: ['CHAT', 'VIDEO'],
    isDemo: true
  },
  {
    id: 'doc-demo-4',
    name: 'Dr. Vikram Seth',
    email: 'dr.vikram@carereach.med',
    phone: '+91 91122 88440',
    role: 'DOCTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-28T16:00:00.000Z',
    specialization: 'General Physician & Sports Medicine',
    qualification: 'MBBS, MS (Orthopaedics)',
    licenseNumber: 'DMC-DL-2018-66231',
    verificationStatus: 'PENDING',
    status: 'OFFLINE',
    experienceYears: 6,
    languages: ['English', 'Hindi', 'Punjabi'],
    clinicAffiliation: 'Campus Sports Arena Clinic',
    clinicAddress: 'Sports Complex Gate 2, 0.8 km',
    coordinates: {
      lat: 12.9810,
      lng: 77.5910
    },
    rating: 4.6,
    totalReviews: 34,
    estimatedResponseTimeMinutes: 8,
    consultationHours: '10 AM - 5 PM',
    consultationTypes: ['CHAT'],
    isDemo: true
  }
];

const INITIAL_FACILITIES: ClinicFacility[] = [
  {
    id: 'fac-1',
    name: 'Campus Health Centre & Infirmary',
    type: 'CAMPUS_HEALTH_CENTRE',
    address: 'Near Central Library, University Campus',
    distanceKm: 0.4,
    phone: '+91 80 2345 6701',
    isOpen24x7: false,
    openHours: '08:00 AM - 09:00 PM (Emergency Night Nurse On-Duty)',
    hasEmergencyTrauma: false,
    coordinates: { lat: 12.9730, lng: 77.5960 }
  },
  {
    id: 'fac-2',
    name: 'City Care 24/7 Emergency & Multi-Specialty Hospital',
    type: 'HOSPITAL',
    address: '42 Outer Ring Road, Near Tech Park (2.8 km)',
    distanceKm: 2.8,
    phone: '+91 80 4000 9999 (Ambulance Hotline: 108 / 102)',
    isOpen24x7: true,
    openHours: 'Open 24 Hours / 7 Days (Trauma Care Available)',
    hasEmergencyTrauma: true,
    coordinates: { lat: 12.9850, lng: 77.6100 }
  },
  {
    id: 'fac-3',
    name: 'Apollo Medical Clinic & Diagnostic Centre',
    type: 'CLINIC',
    address: '14 B Cross, East Gate Commercial Complex',
    distanceKm: 1.5,
    phone: '+91 80 2678 3344',
    isOpen24x7: false,
    openHours: '07:30 AM - 09:30 PM',
    hasEmergencyTrauma: false,
    coordinates: { lat: 12.9690, lng: 77.6080 }
  },
  {
    id: 'fac-4',
    name: 'MedPlus 24-Hour Campus Pharmacy & First Aid Supplies',
    type: 'PHARMACY',
    address: 'Opposite Hostel Gate 3',
    distanceKm: 0.6,
    phone: '+91 80 2211 4455',
    isOpen24x7: true,
    openHours: 'Open 24 Hours',
    hasEmergencyTrauma: false,
    coordinates: { lat: 12.9705, lng: 77.5920 }
  }
];

const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-ai-seed-1',
    studentId: 'student-demo-1',
    title: 'AI Symptom Check: Fever & Headache',
    category: 'SYMPTOM_ASSESSMENT',
    fileUrl: '#',
    fileName: 'Symptom_Assessment_2026-09-27.pdf',
    fileSize: '48 KB',
    uploadedAt: '2026-09-27T14:30:00.000Z',
    sharedWithDoctor: true,
    doctorNotes: 'Student logged mild seasonal fever and tension headache before midterm exam. Recommended hydration and rest.',
    symptomAssessment: {
      symptoms: ['Fever / Hot Body', 'Headache / Dizziness'],
      duration: 'Started today',
      severity: 'moderate',
      summary: 'Body feels hot with mild forehead throbbing. Often linked to late night study, lack of water, or seasonal weather shift.',
      possibleCauses: ['Mild seasonal viral bug', 'Exam fatigue and dehydration'],
      immediateCare: ['Drink small sips of room-temperature water', 'Rest in a quiet hostel room with lights dimmed', 'Place cool damp cloth on forehead'],
      recommendedDoctor: 'General Physician / Campus Dispensary Doctor',
      urgencyLevel: 'ROUTINE_APPOINTMENT',
      voiceDictatedNotes: 'Feeling warm and headache since morning after studying in library.',
      language: 'en'
    }
  },
  {
    id: 'rec-1',
    studentId: 'student-demo-1',
    title: 'University Annual Fitness & Blood Screen',
    category: 'LAB_REPORT',
    fileUrl: '#',
    fileName: 'Campus_Fitness_Certificate_2026.pdf',
    fileSize: '412 KB',
    uploadedAt: '2026-09-02T11:20:00.000Z',
    sharedWithDoctor: true,
    doctorNotes: 'Normal vitals, noted mild dust allergy.'
  },
  {
    id: 'rec-2',
    studentId: 'student-demo-1',
    title: 'Severe Dust Allergy Prescription',
    category: 'PRESCRIPTION',
    fileUrl: '#',
    fileName: 'Allergy_Prescription_Aug2026.jpg',
    fileSize: '1.2 MB',
    uploadedAt: '2026-08-28T09:15:00.000Z',
    sharedWithDoctor: true,
    doctorNotes: 'Prescribed Cetirizine 10mg SOS.'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-29T08:00:00.000Z',
    userId: 'admin-1',
    userName: 'Campus Medical Director (Admin)',
    userRole: 'ADMIN',
    action: 'SYSTEM_BOOT',
    details: 'CareReach Platform started. Health telemetry active.',
    severity: 'INFO'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-29T08:15:00.000Z',
    userId: 'admin-1',
    userName: 'Campus Medical Director (Admin)',
    userRole: 'ADMIN',
    action: 'DOCTOR_VERIFICATION',
    details: 'Dr. Priya Venkatesh (MCI-TN-2014-78492) status updated to VERIFIED.',
    severity: 'INFO'
  }
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    userId: 'student-demo-1',
    title: 'Welcome to CareReach',
    message: 'Your hostel profile and emergency contacts are active. In case of sudden illness, tap "Request a Doctor".',
    type: 'CONSULTATION_STARTED',
    read: false,
    timestamp: '2026-09-29T08:30:00.000Z'
  },
  {
    id: 'notif-2',
    userId: 'doc-demo-1',
    title: 'Doctor Portal Ready',
    message: 'You are set as AVAILABLE for nearby campus emergency requests.',
    type: 'DOCTOR_VERIFIED',
    read: true,
    timestamp: '2026-09-29T08:20:00.000Z'
  }
];

// Helper to generate next-day date string YYYY-MM-DD
function getNextDayDateString(offsetDays: number = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const INITIAL_APPOINTMENT_SLOTS: AppointmentSlot[] = [
  {
    id: 'slot-1',
    doctorId: 'doc-demo-1',
    doctorName: 'Dr. Priya Venkatesh',
    facilityName: 'Campus Health Centre & Dispensary',
    facilityAddress: 'Near Central Library, University Campus',
    type: 'CAMPUS_HEALTH_CENTRE',
    date: getNextDayDateString(1),
    time: '09:30 AM',
    distanceKm: 0.4,
    isBooked: false
  },
  {
    id: 'slot-2',
    doctorId: 'doc-demo-1',
    doctorName: 'Dr. Priya Venkatesh',
    facilityName: 'Campus Health Centre & Dispensary',
    facilityAddress: 'Near Central Library, University Campus',
    type: 'CAMPUS_HEALTH_CENTRE',
    date: getNextDayDateString(1),
    time: '11:00 AM',
    distanceKm: 0.4,
    isBooked: false
  },
  {
    id: 'slot-3',
    doctorId: 'doc-demo-1',
    doctorName: 'Dr. Priya Venkatesh',
    facilityName: 'City Urgent Care Clinic',
    facilityAddress: 'East Gate Health Avenue, 1.2 km from Campus',
    type: 'CLINIC_VISIT',
    date: getNextDayDateString(1),
    time: '02:30 PM',
    distanceKm: 1.2,
    isBooked: false
  },
  {
    id: 'slot-4',
    doctorId: 'doc-demo-2',
    doctorName: 'Dr. Rajesh Kulkarni',
    facilityName: 'Apollo Clinic & Emergency Response',
    facilityAddress: 'Hosur Road Junction, 2.1 km from Campus',
    type: 'CLINIC_VISIT',
    date: getNextDayDateString(1),
    time: '10:00 AM',
    distanceKm: 2.1,
    isBooked: false
  },
  {
    id: 'slot-5',
    doctorId: 'doc-demo-3',
    doctorName: 'Dr. Ananya Roy',
    facilityName: 'Student Wellness Pavilion',
    facilityAddress: 'Student Centre Wing C, 0.5 km',
    type: 'CAMPUS_HEALTH_CENTRE',
    date: getNextDayDateString(2),
    time: '04:00 PM',
    distanceKm: 0.5,
    isBooked: false
  }
];

// Seed an initial completed consultation as demo proof
const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'consult-seed-demo',
    requestId: 'req-seed-demo',
    studentId: 'student-demo-1',
    studentName: 'Arjun Sharma',
    studentHostel: 'Kaveri Boys Hostel (Block 4B), Room 204',
    studentAge: 20,
    doctorId: 'doc-demo-1',
    doctorName: 'Dr. Priya Venkatesh',
    doctorSpecialty: 'Internal Medicine & Urgent Care',
    status: 'COMPLETED',
    startedAt: '2026-09-28T21:40:00.000Z',
    endedAt: '2026-09-28T22:05:00.000Z',
    guidance: {
      id: 'guide-seed-1',
      consultationId: 'consult-seed-demo',
      doctorId: 'doc-demo-1',
      doctorName: 'Dr. Priya Venkatesh',
      doctorLicense: 'MCI-TN-2014-78492',
      immediateGuidance: 'Elevate right ankle with hostel pillow, apply cold water pack/ice for 15 mins every 2 hours.',
      selfCareInstructions: 'Do not bear weight on right ankle tonight. Take Paracetamol 500mg if pain disrupts sleep. Drink plenty of water.',
      warningSigns: [
        'Sudden inability to move toes',
        'Visible deformation or open wound',
        'Severe throbbing numbness'
      ],
      followUpRecommended: true,
      followUpReason: 'Clinical examination and possible X-ray if swelling persists tomorrow morning.',
      studentSummary: 'Doctor Dr. Priya evaluated minor basketball ankle sprain. Cold pack + elevation advised. Follow-up booked for next morning at Campus Health Centre.',
      createdAt: '2026-09-28T21:46:00.000Z'
    },
    followUpAppointmentId: 'appt-seed-1',
    review: {
      rating: 5,
      comment: 'Doctor replied in less than 2 minutes when I twisted my ankle in the hostel court. Great guidance!',
      createdAt: '2026-09-28T22:10:00.000Z'
    }
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'consult-seed-demo': [
    {
      id: 'm-seed-1',
      consultationId: 'consult-seed-demo',
      senderId: 'system',
      senderRole: 'ADMIN',
      senderName: 'CareReach System',
      text: 'Consultation initiated. Dr. Priya Venkatesh has joined to review student symptoms.',
      timestamp: '2026-09-28T21:40:00.000Z',
      isSystem: true
    },
    {
      id: 'm-seed-2',
      consultationId: 'consult-seed-demo',
      senderId: 'student-demo-1',
      senderRole: 'STUDENT',
      senderName: 'Arjun Sharma',
      text: 'Good evening Dr. Priya, I twisted my ankle 30 mins ago on the hostel court. It is swollen and hurting when I step.',
      timestamp: '2026-09-28T21:41:00.000Z'
    },
    {
      id: 'm-seed-3',
      consultationId: 'consult-seed-demo',
      senderId: 'doc-demo-1',
      senderRole: 'DOCTOR',
      senderName: 'Dr. Priya Venkatesh',
      text: 'Hello Arjun. Keep your leg elevated right now. Can you gently wiggle all five toes without excruciating pain?',
      timestamp: '2026-09-28T21:42:00.000Z'
    },
    {
      id: 'm-seed-4',
      consultationId: 'consult-seed-demo',
      senderId: 'student-demo-1',
      senderRole: 'STUDENT',
      senderName: 'Arjun Sharma',
      text: 'Yes doctor, I can wiggle them! It just hurts around the outer ligament.',
      timestamp: '2026-09-28T21:43:00.000Z'
    },
    {
      id: 'm-seed-5',
      consultationId: 'consult-seed-demo',
      senderId: 'doc-demo-1',
      senderRole: 'DOCTOR',
      senderName: 'Dr. Priya Venkatesh',
      text: 'That is reassuring—it indicates no major nerve blockage. I am issuing structured care instructions now. I also strongly advise you visit me at the Campus Health Centre tomorrow for a palpation check.',
      timestamp: '2026-09-28T21:45:00.000Z'
    },
    {
      id: 'm-seed-6',
      consultationId: 'consult-seed-demo',
      senderId: 'system',
      senderRole: 'DOCTOR',
      senderName: 'Dr. Priya Venkatesh',
      text: '📋 Verified Care Guidance has been issued by Dr. Priya Venkatesh.',
      timestamp: '2026-09-28T21:47:00.000Z',
      isSystem: true
    }
  ]
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-seed-1',
    studentId: 'student-demo-1',
    studentName: 'Arjun Sharma',
    studentPhone: '+91 98765 43210',
    doctorId: 'doc-demo-1',
    doctorName: 'Dr. Priya Venkatesh',
    doctorSpecialty: 'Internal Medicine & Urgent Care',
    facilityName: 'Campus Health Centre & Dispensary',
    facilityAddress: 'Near Central Library, University Campus',
    type: 'CAMPUS_HEALTH_CENTRE',
    date: getNextDayDateString(1),
    time: '09:30 AM',
    status: 'CONFIRMED',
    reason: 'Follow-up physical assessment for ankle sprain',
    consultationId: 'consult-seed-demo',
    createdAt: '2026-09-28T21:48:00.000Z',
    reminderSent: true
  }
];

// LocalStorage Persistence Keys
const STORAGE_KEY = 'carereach_state_v1';

export interface AppState {
  currentRole: UserRole;
  currentUserId: string;
  student: StudentProfile;
  doctors: DoctorProfile[];
  facilities: ClinicFacility[];
  requests: EmergencyRequest[];
  consultations: Consultation[];
  messages: Record<string, Message[]>; // consultationId -> messages
  appointments: Appointment[];
  appointmentSlots: AppointmentSlot[];
  records: MedicalRecord[];
  auditLogs: AuditLog[];
  notifications: InAppNotification[];
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
  }

  const defaultState: AppState = {
    currentRole: 'STUDENT',
    currentUserId: INITIAL_STUDENT.id,
    student: INITIAL_STUDENT,
    doctors: INITIAL_DOCTORS,
    facilities: INITIAL_FACILITIES,
    requests: [],
    consultations: INITIAL_CONSULTATIONS,
    messages: INITIAL_MESSAGES,
    appointments: INITIAL_APPOINTMENTS,
    appointmentSlots: INITIAL_APPOINTMENT_SLOTS,
    records: INITIAL_RECORDS,
    auditLogs: INITIAL_AUDIT_LOGS,
    notifications: INITIAL_NOTIFICATIONS
  };

  saveState(defaultState);
  return defaultState;
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Broadcast change to other open tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('carereach-sync-channel');
      channel.postMessage({ type: 'STATE_UPDATED', timestamp: Date.now() });
    }
  } catch (err) {
    console.error('Failed to save CareReach state:', err);
  }
}

// In-Memory Global Store Instance
let currentState: AppState = loadState();
const listeners = new Set<(state: AppState) => void>();

// Setup BroadcastChannel for multi-tab sync
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  const syncChannel = new BroadcastChannel('carereach-sync-channel');
  syncChannel.onmessage = () => {
    currentState = loadState();
    listeners.forEach((listener) => listener(currentState));
  };
}

export const CareReachStore = {
  getState(): AppState {
    return currentState;
  },

  subscribe(listener: (state: AppState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify(): void {
    saveState(currentState);
    listeners.forEach((fn) => fn(currentState));
  },

  resetDemoState(): void {
    localStorage.removeItem(STORAGE_KEY);
    currentState = loadState();
    this.notify();
  },

  // Auth / Role management
  switchUser(role: UserRole, id?: string): void {
    currentState.currentRole = role;
    if (role === 'STUDENT') {
      currentState.currentUserId = id || currentState.student.id;
    } else if (role === 'DOCTOR') {
      currentState.currentUserId = id || currentState.doctors[0].id;
    } else {
      currentState.currentUserId = 'admin-1';
    }
    this.addAuditLog(
      'USER_SWITCH',
      `Switched session to role: ${role} (ID: ${currentState.currentUserId})`,
      'INFO'
    );
    this.notify();
  },

  getCurrentUser(): User {
    if (currentState.currentRole === 'STUDENT') {
      return currentState.student;
    }
    if (currentState.currentRole === 'DOCTOR') {
      const doc = currentState.doctors.find((d) => d.id === currentState.currentUserId) || currentState.doctors[0];
      return doc;
    }
    return {
      id: 'admin-1',
      name: 'Dr. S. Ramachandran (Campus Medical Director)',
      email: 'admin.health@campus.edu',
      phone: '+91 80 2345 6700',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      createdAt: '2026-08-01T00:00:00.000Z'
    };
  },

  updateStudentProfile(updates: Partial<StudentProfile>): void {
    currentState.student = { ...currentState.student, ...updates };
    this.addAuditLog('PROFILE_UPDATE', 'Student profile details updated', 'INFO');
    this.notify();
  },

  updateDoctorStatus(doctorId: string, status: DoctorStatus): void {
    currentState.doctors = currentState.doctors.map((d) =>
      d.id === doctorId ? { ...d, status } : d
    );
    syncDoctorStatusToDb(doctorId, status);
    this.addAuditLog(
      'DOCTOR_STATUS_CHANGE',
      `Doctor ${doctorId} set availability status to ${status}`,
      'INFO'
    );
    this.notify();
  },

  registerDoctor(profile: Omit<DoctorProfile, 'id' | 'createdAt' | 'rating' | 'totalReviews' | 'verificationStatus'>): DoctorProfile {
    const newDoc: DoctorProfile = {
      ...profile,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      totalReviews: 0,
      verificationStatus: 'PENDING'
    };
    currentState.doctors.unshift(newDoc);
    this.addAuditLog(
      'DOCTOR_REGISTRATION',
      `New doctor registered: ${newDoc.name} (${newDoc.licenseNumber}), queued for verification.`,
      'INFO'
    );
    this.pushNotification(
      'admin-1',
      'Doctor Verification Pending',
      `${newDoc.name} submitted license credentials for approval.`,
      'DOCTOR_VERIFIED',
      '/admin/doctors'
    );
    this.notify();
    return newDoc;
  },

  verifyDoctor(doctorId: string, status: 'VERIFIED' | 'REJECTED'): void {
    currentState.doctors = currentState.doctors.map((d) =>
      d.id === doctorId ? { ...d, verificationStatus: status } : d
    );
    const doc = currentState.doctors.find((d) => d.id === doctorId);
    this.addAuditLog(
      'DOCTOR_VERIFICATION_DECISION',
      `Doctor ${doc?.name || doctorId} verification was set to: ${status}`,
      'INFO'
    );
    if (doc) {
      this.pushNotification(
        doc.id,
        `Verification ${status === 'VERIFIED' ? 'Approved' : 'Status Updated'}`,
        status === 'VERIFIED'
          ? 'Your medical license has been verified. You can now accept student emergency requests.'
          : 'Your credentials could not be verified at this time.',
        'DOCTOR_VERIFIED'
      );
    }
    this.notify();
  },

  // Emergency Requests Flow
  createEmergencyRequest(
    data: {
      symptoms: string[];
      description: string;
      startedWhen: string;
      severity: RequestSeverity;
      studentCoordinates: { lat: number; lng: number; address: string };
      isEmergencyFlagged: boolean;
      attachments?: { name: string; type: string; url: string }[];
    }
  ): EmergencyRequest {
    const newReq: EmergencyRequest = {
      id: `req-${Date.now()}`,
      studentId: currentState.student.id,
      studentName: currentState.student.name,
      studentAge: currentState.student.age,
      studentHostel: `${currentState.student.hostelName}, ${currentState.student.hostelRoom}`,
      studentCoordinates: data.studentCoordinates,
      symptoms: data.symptoms,
      description: data.description,
      startedWhen: data.startedWhen,
      severity: data.severity,
      attachments: data.attachments || [],
      isEmergencyFlagged: data.isEmergencyFlagged,
      status: data.isEmergencyFlagged ? 'ESCALATED_EMERGENCY' : 'PENDING_MATCH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString() // 60-second response window
    };

    currentState.requests.unshift(newReq);
    syncEmergencyRequestToDb(newReq);

    this.addAuditLog(
      data.isEmergencyFlagged ? 'EMERGENCY_ESCALATION' : 'REQUEST_CREATED',
      `Student ${newReq.studentName} created request for: ${newReq.symptoms.join(', ')} (${newReq.severity})`,
      data.isEmergencyFlagged ? 'CRITICAL' : 'INFO'
    );

    // Notify online doctors
    if (!data.isEmergencyFlagged) {
      currentState.doctors
        .filter((d) => d.status === 'AVAILABLE' && d.verificationStatus === 'VERIFIED')
        .forEach((doc) => {
          this.pushNotification(
            doc.id,
            '🚨 New Nearby Student Medical Request',
            `${newReq.studentName} at ${newReq.studentHostel} reported ${newReq.symptoms[0] || 'symptoms'}. Response needed.`,
            'NEW_DOCTOR_REQUEST',
            `/doctor/requests`
          );
        });
    } else {
      // Flag emergency escalation to admin
      this.pushNotification(
        'admin-1',
        '⚠️ CRITICAL: Emergency Escalation Triggered',
        `Student ${newReq.studentName} reported emergency red-flag indicators. SOS triggered.`,
        'EMERGENCY_ESCALATION',
        `/admin/requests`
      );
    }

    this.notify();
    return newReq;
  },

  acceptRequest(requestId: string, doctorId: string): Consultation | null {
    const req = currentState.requests.find((r) => r.id === requestId);
    const doc = currentState.doctors.find((d) => d.id === doctorId);
    if (!req || !doc) return null;

    const consultationId = `consult-${Date.now()}`;
    req.status = 'ACCEPTED';
    req.matchedDoctorId = doc.id;
    req.assignedDoctorName = doc.name;
    req.assignedDoctorSpecialty = doc.specialization;
    req.consultationId = consultationId;
    req.updatedAt = new Date().toISOString();

    const newConsultation: Consultation = {
      id: consultationId,
      requestId: req.id,
      studentId: req.studentId,
      studentName: req.studentName,
      studentHostel: req.studentHostel,
      studentAge: req.studentAge,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialization,
      status: 'ACTIVE',
      startedAt: new Date().toISOString()
    };

    currentState.consultations.unshift(newConsultation);
    syncEmergencyRequestToDb(req);
    syncConsultationToDb(newConsultation);

    // Initial system message and student intake summary in chat
    currentState.messages[consultationId] = [
      {
        id: `msg-${Date.now()}-sys1`,
        consultationId,
        senderId: 'system',
        senderRole: 'ADMIN',
        senderName: 'CareReach System',
        text: `🔒 Secure medical consultation connected between ${req.studentName} and ${doc.name} (${doc.specialization}).`,
        timestamp: new Date().toISOString(),
        isSystem: true
      },
      {
        id: `msg-${Date.now()}-intake`,
        consultationId,
        senderId: req.studentId,
        senderRole: 'STUDENT',
        senderName: req.studentName,
        text: `📋 Student Intake Report:\n• Primary concern: ${req.symptoms.join(', ')}\n• Onset: ${req.startedWhen}\n• Severity: ${req.severity}\n• Details: "${req.description}"\n• Location: ${req.studentHostel}`,
        timestamp: new Date(Date.now() + 100).toISOString()
      },
      {
        id: `msg-${Date.now()}-doc1`,
        consultationId,
        senderId: doc.id,
        senderRole: 'DOCTOR',
        senderName: doc.name,
        text: `Hello ${req.studentName}, this is ${doc.name}. I am reviewing your symptoms right now. Please sit down comfortably in your room. Can you tell me if you have taken any medicine for this today?`,
        timestamp: new Date(Date.now() + 200).toISOString()
      }
    ];

    // Notifications & FCM Real-Time Push
    this.pushNotification(
      req.studentId,
      'Doctor Connected!',
      `${doc.name} accepted your request and has opened the secure consultation workspace.`,
      'REQUEST_ACCEPTED',
      `/student/consultation/${consultationId}`
    );

    // Dispatch Firebase Cloud Messaging push notification to student
    sendDoctorMatchedPushNotification({
      studentId: req.studentId,
      studentName: req.studentName,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialization,
      consultationId
    });

    this.addAuditLog(
      'CONSULTATION_STARTED',
      `${doc.name} accepted consultation request for student ${req.studentName}`,
      'INFO'
    );

    this.notify();
    return newConsultation;
  },

  declineRequest(requestId: string, doctorId: string): void {
    const req = currentState.requests.find((r) => r.id === requestId);
    if (!req) return;

    // Fallback search: find another available verified doctor
    const otherDoc = currentState.doctors.find(
      (d) => d.id !== doctorId && d.status === 'AVAILABLE' && d.verificationStatus === 'VERIFIED'
    );

    if (otherDoc) {
      req.matchedDoctorId = otherDoc.id;
      req.assignedDoctorName = otherDoc.name;
      req.assignedDoctorSpecialty = otherDoc.specialization;
      req.expiresAt = new Date(Date.now() + 60 * 1000).toISOString();
      this.pushNotification(
        req.studentId,
        'Rerouting to Nearby Doctor',
        `Re-routing your request to ${otherDoc.name} (${otherDoc.specialization}).`,
        'NEW_DOCTOR_REQUEST'
      );
      this.pushNotification(
        otherDoc.id,
        '🚨 Incoming Student Medical Request',
        `${req.studentName} needs assistance for ${req.symptoms[0] || 'symptoms'}.`,
        'NEW_DOCTOR_REQUEST',
        '/doctor/requests'
      );
    } else {
      req.status = 'DECLINED';
      this.pushNotification(
        req.studentId,
        'No Nearby Doctor Available',
        'No nearby verified doctor is currently online. Please visit the Campus Health Centre or 24/7 Hospital.',
        'EMERGENCY_ESCALATION'
      );
    }

    this.addAuditLog(
      'REQUEST_DECLINED',
      `Doctor ${doctorId} declined request ${requestId}. Fallback engaged.`,
      'WARN'
    );

    this.notify();
  },

  // Messaging in Consultation
  sendMessage(
    consultationId: string,
    senderId: string,
    senderRole: UserRole,
    senderName: string,
    text: string,
    attachment?: { name: string; type: string; url: string }
  ): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      consultationId,
      senderId,
      senderRole,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      attachment
    };

    if (!currentState.messages[consultationId]) {
      currentState.messages[consultationId] = [];
    }
    currentState.messages[consultationId].push(newMsg);
    syncMessageToDb(consultationId, newMsg);

    // Notify counterpart
    const consultation = currentState.consultations.find((c) => c.id === consultationId);
    if (consultation) {
      const recipientId = senderRole === 'STUDENT' ? consultation.doctorId : consultation.studentId;
      this.pushNotification(
        recipientId,
        `New Message from ${senderName}`,
        text.length > 50 ? `${text.substring(0, 47)}...` : text,
        'NEW_MESSAGE',
        senderRole === 'STUDENT' ? `/doctor/consultation/${consultationId}` : `/student/consultation/${consultationId}`
      );
    }

    this.notify();
    return newMsg;
  },

  // Care Guidance submission by Doctor
  submitCareGuidance(
    consultationId: string,
    guidanceData: {
      immediateGuidance: string;
      selfCareInstructions: string;
      warningSigns: string[];
      followUpRecommended: boolean;
      followUpReason?: string;
      doctorPrivateNotes?: string;
      studentSummary: string;
    }
  ): CareGuidance | null {
    const consult = currentState.consultations.find((c) => c.id === consultationId);
    const doc = currentState.doctors.find((d) => d.id === consult?.doctorId);
    if (!consult || !doc) return null;

    const guidance: CareGuidance = {
      id: `guide-${Date.now()}`,
      consultationId,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorLicense: doc.licenseNumber,
      immediateGuidance: guidanceData.immediateGuidance,
      selfCareInstructions: guidanceData.selfCareInstructions,
      warningSigns: guidanceData.warningSigns,
      followUpRecommended: guidanceData.followUpRecommended,
      followUpReason: guidanceData.followUpReason,
      doctorPrivateNotes: guidanceData.doctorPrivateNotes,
      studentSummary: guidanceData.studentSummary,
      createdAt: new Date().toISOString()
    };

    consult.guidance = guidance;
    syncConsultationToDb(consult);

    // Send system alert in chat
    if (!currentState.messages[consultationId]) {
      currentState.messages[consultationId] = [];
    }
    currentState.messages[consultationId].push({
      id: `msg-${Date.now()}-guidance`,
      consultationId,
      senderId: doc.id,
      senderRole: 'DOCTOR',
      senderName: doc.name,
      text: `📋 Official Medical Care Guidance Issued:\n• Immediate: ${guidance.immediateGuidance}\n• Self-Care: ${guidance.selfCareInstructions}\n• Follow-Up Recommended: ${guidance.followUpRecommended ? 'YES - Next-Day In-Person Clinic Visit' : 'NO'}`,
      timestamp: new Date().toISOString(),
      isSystem: true
    });

    // Auto-create a medical record in student vault
    currentState.records.unshift({
      id: `rec-${Date.now()}`,
      studentId: consult.studentId,
      title: `Consultation Guidance - ${doc.name} (${new Date().toLocaleDateString()})`,
      category: 'CONSULTATION_NOTE',
      fileUrl: '#',
      fileName: `CareReach_Guidance_${consultationId.slice(-6)}.pdf`,
      fileSize: '184 KB',
      uploadedAt: new Date().toISOString(),
      sharedWithDoctor: true,
      doctorNotes: guidance.studentSummary
    });

    this.pushNotification(
      consult.studentId,
      'Care Guidance Available',
      `${doc.name} has provided first-aid guidance and follow-up recommendations.`,
      'CONSULTATION_STARTED',
      `/student/consultation/${consultationId}`
    );

    this.addAuditLog(
      'GUIDANCE_ISSUED',
      `Dr. ${doc.name} issued medical guidance for consultation ${consultationId}`,
      'INFO'
    );

    this.notify();
    return guidance;
  },

  endConsultation(consultationId: string): void {
    const consult = currentState.consultations.find((c) => c.id === consultationId);
    if (!consult) return;

    consult.status = 'COMPLETED';
    consult.endedAt = new Date().toISOString();

    const req = currentState.requests.find((r) => r.id === consult.requestId);
    if (req) {
      req.status = 'COMPLETED';
    }

    if (!currentState.messages[consultationId]) {
      currentState.messages[consultationId] = [];
    }
    currentState.messages[consultationId].push({
      id: `msg-${Date.now()}-ended`,
      consultationId,
      senderId: 'system',
      senderRole: 'ADMIN',
      senderName: 'CareReach System',
      text: 'Consultation concluded. You can review the care guidance and book your follow-up clinic appointment below.',
      timestamp: new Date().toISOString(),
      isSystem: true
    });

    this.addAuditLog(
      'CONSULTATION_ENDED',
      `Consultation ${consultationId} concluded.`,
      'INFO'
    );

    this.notify();
  },

  submitReview(consultationId: string, rating: number, comment: string): void {
    const consult = currentState.consultations.find((c) => c.id === consultationId);
    if (!consult) return;

    consult.review = {
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    // Update doctor's aggregated rating
    const doc = currentState.doctors.find((d) => d.id === consult.doctorId);
    if (doc) {
      const newTotal = doc.totalReviews + 1;
      doc.rating = Math.round(((doc.rating * doc.totalReviews + rating) / newTotal) * 10) / 10;
      doc.totalReviews = newTotal;
    }

    this.notify();
  },

  // Next-Day Appointment System
  bookAppointment(data: {
    studentId: string;
    studentName: string;
    studentPhone: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    facilityName: string;
    facilityAddress: string;
    type: AppointmentType;
    date: string;
    time: string;
    reason: string;
    consultationId?: string;
  }): Appointment {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      studentPhone: data.studentPhone,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      facilityName: data.facilityName,
      facilityAddress: data.facilityAddress,
      type: data.type,
      date: data.date,
      time: data.time,
      status: 'CONFIRMED',
      reason: data.reason,
      consultationId: data.consultationId,
      createdAt: new Date().toISOString(),
      reminderSent: true
    };

    currentState.appointments.unshift(newAppt);
    syncAppointmentToDb(newAppt);

    // If linked to a consultation, link it
    if (data.consultationId) {
      const consult = currentState.consultations.find((c) => c.id === data.consultationId);
      if (consult) {
        consult.followUpAppointmentId = newAppt.id;
      }
    }

    // Mark slot as booked if exists
    currentState.appointmentSlots = currentState.appointmentSlots.map((s) =>
      s.doctorId === data.doctorId && s.date === data.date && s.time === data.time
        ? { ...s, isBooked: true }
        : s
    );

    this.pushNotification(
      data.studentId,
      'Appointment Confirmed',
      `Your follow-up visit with ${data.doctorName} is booked for ${data.date} at ${data.time} (${data.facilityName}).`,
      'APPOINTMENT_BOOKED',
      '/student/appointments'
    );

    this.pushNotification(
      data.doctorId,
      'New Patient Appointment',
      `Student ${data.studentName} booked a follow-up slot on ${data.date} at ${data.time}.`,
      'APPOINTMENT_BOOKED',
      '/doctor/appointments'
    );

    this.addAuditLog(
      'APPOINTMENT_BOOKED',
      `Appointment ${newAppt.id} booked for ${newAppt.studentName} with ${newAppt.doctorName} on ${newAppt.date} at ${newAppt.time}`,
      'INFO'
    );

    this.notify();
    return newAppt;
  },

  cancelAppointment(appointmentId: string, reason?: string): void {
    const appt = currentState.appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    appt.status = 'CANCELLED';

    // Unbook the slot
    currentState.appointmentSlots = currentState.appointmentSlots.map((s) =>
      s.doctorId === appt.doctorId && s.date === appt.date && s.time === appt.time
        ? { ...s, isBooked: false }
        : s
    );

    this.pushNotification(
      appt.studentId,
      'Appointment Cancelled',
      `Your appointment with ${appt.doctorName} on ${appt.date} was cancelled.`,
      'APPOINTMENT_REMINDER'
    );

    this.addAuditLog(
      'APPOINTMENT_CANCELLED',
      `Appointment ${appointmentId} was cancelled (${reason || 'No reason provided'}).`,
      'INFO'
    );

    this.notify();
  },

  // Health Records Vault
  addMedicalRecord(record: Omit<MedicalRecord, 'id' | 'uploadedAt'>): MedicalRecord {
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    currentState.records.unshift(newRecord);
    syncMedicalRecordToDb(newRecord);
    this.addAuditLog(
      'RECORD_UPLOAD',
      `Student uploaded medical document: ${newRecord.title} (${newRecord.category})`,
      'INFO'
    );
    this.notify();
    return newRecord;
  },

  deleteMedicalRecord(recordId: string): void {
    const rec = currentState.records.find((r) => r.id === recordId);
    currentState.records = currentState.records.filter((r) => r.id !== recordId);
    if (rec) {
      this.addAuditLog(
        'RECORD_DELETE',
        `Student deleted medical document: ${rec.title}`,
        'WARN'
      );
    }
    this.notify();
  },

  toggleRecordSharing(recordId: string): void {
    currentState.records = currentState.records.map((r) =>
      r.id === recordId ? { ...r, sharedWithDoctor: !r.sharedWithDoctor } : r
    );
    this.notify();
  },

  // Notifications
  pushNotification(
    userId: string,
    title: string,
    message: string,
    type: InAppNotification['type'],
    linkUrl?: string
  ): void {
    const notif: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      linkUrl
    };
    currentState.notifications.unshift(notif);
    // Keep max 50 notifications
    if (currentState.notifications.length > 50) {
      currentState.notifications.pop();
    }
  },

  markNotificationRead(notificationId: string): void {
    currentState.notifications = currentState.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notify();
  },

  markAllNotificationsRead(userId: string): void {
    currentState.notifications = currentState.notifications.map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    this.notify();
  },

  // Audit Logs
  addAuditLog(
    action: string,
    details: string,
    severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO'
  ): void {
    const user = this.getCurrentUser();
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      details,
      ipAddress: '127.0.0.1 (Local Campus Subnet)',
      severity
    };
    currentState.auditLogs.unshift(log);
    syncAuditLogToDb(log);
    if (currentState.auditLogs.length > 200) {
      currentState.auditLogs.pop();
    }
  }
};
