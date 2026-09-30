export type UserRole = 'STUDENT' | 'DOCTOR' | 'ADMIN';

export type DoctorStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type RequestSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export type RequestStatus = 
  | 'PENDING_MATCH' 
  | 'DOCTOR_ASSIGNED' 
  | 'ACCEPTED' 
  | 'DECLINED' 
  | 'IN_CONSULTATION' 
  | 'COMPLETED' 
  | 'ESCALATED_EMERGENCY' 
  | 'CANCELLED';

export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export type AppointmentType = 
  | 'CAMPUS_HEALTH_CENTRE' 
  | 'CLINIC_VISIT' 
  | 'FOLLOW_UP_REMOTE' 
  | 'SPECIALIST_REFERRAL';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'STUDENT';
  age: number;
  gender?: string;
  college: string;
  hostelName: string;
  hostelRoom: string;
  coordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalInfo: {
    allergies: string[];
    existingConditions: string[];
    currentMedications: string[];
    bloodGroup?: string;
  };
  privacySettings: {
    shareRoomNumber: boolean;
    shareMedicalHistory: boolean;
    allowLocationTracking: boolean;
  };
}

export interface DoctorProfile extends User {
  role: 'DOCTOR';
  specialization: string;
  qualification: string;
  licenseNumber: string;
  verificationStatus: VerificationStatus;
  status: DoctorStatus;
  experienceYears: number;
  languages: string[];
  clinicAffiliation: string;
  clinicAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  totalReviews: number;
  estimatedResponseTimeMinutes: number;
  consultationHours: string;
  consultationTypes: ('CHAT' | 'VOICE' | 'VIDEO')[];
  isDemo?: boolean;
}

export interface EmergencyRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAge: number;
  studentHostel: string;
  studentCoordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  symptoms: string[];
  description: string;
  startedWhen: string;
  severity: RequestSeverity;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  isEmergencyFlagged: boolean;
  status: RequestStatus;
  matchedDoctorId?: string;
  assignedDoctorName?: string;
  assignedDoctorSpecialty?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  matchScore?: number;
  consultationId?: string;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface CareGuidance {
  id: string;
  consultationId: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  immediateGuidance: string;
  selfCareInstructions: string;
  warningSigns: string[];
  followUpRecommended: boolean;
  followUpReason?: string;
  doctorPrivateNotes?: string;
  studentSummary: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  studentHostel: string;
  studentAge: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  endedAt?: string;
  guidance?: CareGuidance;
  followUpAppointmentId?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface AppointmentSlot {
  id: string;
  doctorId: string;
  doctorName: string;
  facilityName: string;
  facilityAddress: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  distanceKm: number;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
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
  status: AppointmentStatus;
  reason: string;
  consultationId?: string;
  createdAt: string;
  reminderSent?: boolean;
}

export interface MedicalRecord {
  id: string;
  studentId: string;
  title: string;
  category: 'PRESCRIPTION' | 'LAB_REPORT' | 'CONSULTATION_NOTE' | 'DISCHARGE_SUMMARY' | 'SYMPTOM_ASSESSMENT' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  sharedWithDoctor: boolean;
  doctorNotes?: string;
  symptomAssessment?: {
    symptoms: string[];
    duration: string;
    severity: 'mild' | 'moderate' | 'severe';
    summary: string;
    possibleCauses: string[];
    immediateCare: string[];
    recommendedDoctor: string;
    urgencyLevel: string;
    voiceDictatedNotes?: string;
    language?: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'REQUEST_ACCEPTED' 
    | 'NEW_DOCTOR_REQUEST' 
    | 'CONSULTATION_STARTED' 
    | 'NEW_MESSAGE' 
    | 'APPOINTMENT_BOOKED' 
    | 'APPOINTMENT_REMINDER' 
    | 'EMERGENCY_ESCALATION'
    | 'DOCTOR_VERIFIED';
  read: boolean;
  timestamp: string;
  linkUrl?: string;
}

export interface ClinicFacility {
  id: string;
  name: string;
  type: 'CAMPUS_HEALTH_CENTRE' | 'HOSPITAL' | 'CLINIC' | 'PHARMACY';
  address: string;
  distanceKm: number;
  phone: string;
  isOpen24x7: boolean;
  openHours: string;
  hasEmergencyTrauma: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}
