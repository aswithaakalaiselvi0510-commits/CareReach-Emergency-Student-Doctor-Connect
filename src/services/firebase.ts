import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// If custom firestoreDatabaseId exists, pass it as second arg to getFirestore
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Authenticate anonymously so requests pass security rules
signInAnonymously(auth).catch((err) => {
  console.log('Anonymous auth note (not fatal):', err.message);
});

// Test connection on boot as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

testFirestoreConnection();

/**
 * Cloud Firestore Database Synchronization Helpers
 */

export async function syncEmergencyRequestToDb(request: any) {
  try {
    await setDoc(doc(db, 'emergencyRequests', request.id), {
      ...request,
      updatedAtServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (request):', err);
  }
}

export async function syncConsultationToDb(consultation: any) {
  try {
    await setDoc(doc(db, 'consultations', consultation.id), {
      ...consultation,
      updatedAtServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (consultation):', err);
  }
}

export async function syncMessageToDb(consultationId: string, message: any) {
  try {
    await setDoc(doc(db, 'consultations', consultationId, 'messages', message.id), {
      ...message,
      timestampServer: Timestamp.now()
    });
  } catch (err) {
    console.warn('Firestore sync note (message):', err);
  }
}

export async function syncAppointmentToDb(appointment: any) {
  try {
    await setDoc(doc(db, 'appointments', appointment.id), {
      ...appointment,
      updatedAtServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (appointment):', err);
  }
}

export async function syncMedicalRecordToDb(record: any) {
  try {
    await setDoc(doc(db, 'medicalRecords', record.id), {
      ...record,
      updatedAtServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (record):', err);
  }
}

export async function syncAuditLogToDb(log: any) {
  try {
    await setDoc(doc(db, 'auditLogs', log.id), {
      ...log,
      timestampServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (auditLog):', err);
  }
}

export async function syncDoctorStatusToDb(doctorId: string, status: string) {
  try {
    await setDoc(doc(db, 'doctors', doctorId), {
      status,
      updatedAtServer: Timestamp.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync note (doctorStatus):', err);
  }
}
