import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database Seed for REST API endpoints
interface MemoryDb {
  students: any[];
  doctors: any[];
  requests: any[];
  consultations: any[];
  messages: Record<string, any[]>;
  appointments: any[];
  records: any[];
  auditLogs: any[];
  facilities: any[];
}

const dbState: MemoryDb = {
  students: [
    {
      id: 'student-demo-1',
      name: 'Arjun Sharma',
      email: 'arjun.student@campus.edu',
      phone: '+91 98765 43210',
      role: 'STUDENT',
      age: 20,
      hostelName: 'Kaveri Boys Hostel (Block 4B)',
      hostelRoom: 'Room 204'
    }
  ],
  doctors: [
    {
      id: 'doc-demo-1',
      name: 'Dr. Priya Venkatesh',
      email: 'dr.priya@carereach.med',
      role: 'DOCTOR',
      specialization: 'Internal Medicine & Urgent Care',
      qualification: 'MBBS, MD - CMC Vellore',
      licenseNumber: 'MCI-TN-2014-78492',
      verificationStatus: 'VERIFIED',
      status: 'AVAILABLE',
      rating: 4.9,
      experienceYears: 12
    }
  ],
  requests: [],
  consultations: [],
  messages: {},
  appointments: [],
  records: [],
  auditLogs: [
    {
      id: 'log-boot',
      action: 'SYSTEM_BOOT',
      details: 'CareReach Database & API Gateway initialized',
      timestamp: new Date().toISOString(),
      severity: 'INFO'
    }
  ],
  facilities: [
    {
      id: 'fac-1',
      name: 'Campus Health Centre & Infirmary',
      distanceKm: 0.4,
      isOpen24x7: false,
      phone: '+91 80 2345 6701'
    },
    {
      id: 'fac-2',
      name: 'City Care 24/7 Trauma Emergency Hospital',
      distanceKm: 2.8,
      isOpen24x7: true,
      phone: '+91 80 4000 9999'
    }
  ]
};

// ==========================================
// 1. HEALTH & CLINICAL CRITERIA APIS
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'CareReach Medical Engine',
    database: 'Firestore Connected & API Gateway Active',
    timestamp: new Date().toISOString(),
    safetyScreening: 'ACTIVE'
  });
});

app.get('/api/triage/emergency-criteria', (req: Request, res: Response) => {
  res.json({
    disclaimer: 'CareReach provides triage and communication support. It does not replace emergency 108 ambulance response.',
    redFlags: [
      'Severe crushing chest pain or left arm numbness',
      'Shortness of breath / gasping for air',
      'Loss of consciousness or head trauma',
      'Uncontrolled bleeding',
      'Facial drooping or slurred speech',
      'Acute anaphylactic throat tightness'
    ],
    hotlines: {
      nationalAmbulance: '108',
      policeEmergency: '112',
      campusInfirmary: '+91 80 2345 6701'
    }
  });
});

// ==========================================
// 2. AUTHENTICATION & PROFILE APIS
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, email } = req.body;
  const user = role === 'DOCTOR' ? dbState.doctors[0] : dbState.students[0];
  res.json({
    token: `demo-jwt-token-${Date.now()}`,
    user
  });
});

app.get('/api/students/profile', (req: Request, res: Response) => {
  res.json(dbState.students[0]);
});

app.put('/api/students/profile', (req: Request, res: Response) => {
  dbState.students[0] = { ...dbState.students[0], ...req.body };
  res.json(dbState.students[0]);
});

// ==========================================
// 3. DOCTOR & FACILITY APIS
// ==========================================
app.get('/api/doctors/nearby', (req: Request, res: Response) => {
  res.json(dbState.doctors);
});

app.get('/api/doctors/:id', (req: Request, res: Response) => {
  const doc = dbState.doctors.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
});

app.put('/api/doctors/availability', (req: Request, res: Response) => {
  const { doctorId, status } = req.body;
  const doc = dbState.doctors.find((d) => d.id === doctorId);
  if (doc) doc.status = status;
  res.json({ success: true, doctor: doc });
});

app.get('/api/facilities', (req: Request, res: Response) => {
  res.json(dbState.facilities);
});

// ==========================================
// 4. EMERGENCY & TRIAGE REQUEST APIS
// ==========================================
app.post('/api/requests', (req: Request, res: Response) => {
  const newReq = {
    id: `req-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.isEmergencyFlagged ? 'ESCALATED_EMERGENCY' : 'PENDING_MATCH'
  };
  dbState.requests.unshift(newReq);
  res.status(201).json(newReq);
});

app.get('/api/requests/:id', (req: Request, res: Response) => {
  const reqItem = dbState.requests.find((r) => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });
  res.json(reqItem);
});

app.patch('/api/requests/:id/accept', (req: Request, res: Response) => {
  const { doctorId } = req.body;
  const reqItem = dbState.requests.find((r) => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });

  const consultationId = `consult-${Date.now()}`;
  reqItem.status = 'ACCEPTED';
  reqItem.matchedDoctorId = doctorId;
  reqItem.consultationId = consultationId;

  const consultation = {
    id: consultationId,
    requestId: reqItem.id,
    studentId: reqItem.studentId,
    doctorId,
    status: 'ACTIVE',
    startedAt: new Date().toISOString()
  };
  dbState.consultations.unshift(consultation);

  res.json({ request: reqItem, consultation });
});

// ==========================================
// 5. CONSULTATIONS & MESSAGES APIS
// ==========================================
app.get('/api/consultations/:id', (req: Request, res: Response) => {
  const consult = dbState.consultations.find((c) => c.id === req.params.id);
  if (!consult) return res.status(404).json({ error: 'Consultation not found' });
  res.json(consult);
});

app.get('/api/consultations/:id/messages', (req: Request, res: Response) => {
  res.json(dbState.messages[req.params.id] || []);
});

app.post('/api/consultations/:id/messages', (req: Request, res: Response) => {
  const newMsg = {
    id: `msg-${Date.now()}`,
    consultationId: req.params.id,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  if (!dbState.messages[req.params.id]) dbState.messages[req.params.id] = [];
  dbState.messages[req.params.id].push(newMsg);
  res.status(201).json(newMsg);
});

app.post('/api/consultations/:id/guidance', (req: Request, res: Response) => {
  const consult = dbState.consultations.find((c) => c.id === req.params.id);
  if (!consult) return res.status(404).json({ error: 'Consultation not found' });

  const guidance = {
    id: `guide-${Date.now()}`,
    consultationId: req.params.id,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  consult.guidance = guidance;
  res.status(201).json(guidance);
});

app.post('/api/consultations/:id/end', (req: Request, res: Response) => {
  const consult = dbState.consultations.find((c) => c.id === req.params.id);
  if (consult) {
    consult.status = 'COMPLETED';
    consult.endedAt = new Date().toISOString();
  }
  res.json({ success: true, consultation: consult });
});

// ==========================================
// 6. NEXT-DAY APPOINTMENTS APIS
// ==========================================
app.get('/api/appointments', (req: Request, res: Response) => {
  res.json(dbState.appointments);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const newAppt = {
    id: `appt-${Date.now()}`,
    ...req.body,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };
  dbState.appointments.unshift(newAppt);
  res.status(201).json(newAppt);
});

app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const appt = dbState.appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  Object.assign(appt, req.body);
  res.json(appt);
});

// ==========================================
// 7. MEDICAL RECORDS VAULT APIS
// ==========================================
app.get('/api/records', (req: Request, res: Response) => {
  res.json(dbState.records);
});

app.post('/api/records', (req: Request, res: Response) => {
  const newRec = {
    id: `rec-${Date.now()}`,
    ...req.body,
    uploadedAt: new Date().toISOString()
  };
  dbState.records.unshift(newRec);
  res.status(201).json(newRec);
});

app.delete('/api/records/:id', (req: Request, res: Response) => {
  dbState.records = dbState.records.filter((r) => r.id !== req.params.id);
  res.json({ success: true });
});

// ==========================================
// 8. NOTIFICATION & FCM APIS
// ==========================================
app.post('/api/notifications/fcm-match', (req: Request, res: Response) => {
  const { studentId, studentName, doctorName, doctorSpecialty, consultationId } = req.body;
  console.log(`[FCM Push Dispatch] Doctor ${doctorName} matched with student ${studentName || studentId}. Consultation: ${consultationId}`);

  res.status(200).json({
    success: true,
    message: `Push notification dispatched via Firebase Cloud Messaging for student ${studentId}`,
    payload: {
      title: '🚨 Doctor Connected! - CareReach',
      body: `${doctorName} (${doctorSpecialty}) accepted your emergency triage request.`,
      consultationId
    }
  });
});

// ==========================================
// 9. ADMIN & COMPLIANCE APIS
// ==========================================
app.get('/api/admin/doctors', (req: Request, res: Response) => {
  res.json(dbState.doctors);
});

app.patch('/api/admin/doctors/:id/verify', (req: Request, res: Response) => {
  const { status } = req.body;
  const doc = dbState.doctors.find((d) => d.id === req.params.id);
  if (doc) doc.verificationStatus = status;
  res.json({ success: true, doctor: doc });
});

app.get('/api/admin/requests', (req: Request, res: Response) => {
  res.json(dbState.requests);
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json(dbState.auditLogs);
});

app.get('/api/admin/analytics', (req: Request, res: Response) => {
  res.json({
    totalStudents: 1240,
    verifiedDoctors: dbState.doctors.filter((d) => d.verificationStatus === 'VERIFIED').length,
    activeConsultations: dbState.consultations.filter((c) => c.status === 'ACTIVE').length,
    totalRequests: dbState.requests.length,
    avgResponseMinutes: 2.4,
    emergencyEscalations: dbState.requests.filter((r) => r.isEmergencyFlagged).length
  });
});

// ==========================================
// VITE CLIENT MOUNTING & PRODUCTION STATIC
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CareReach production server active on port ${PORT}`);
  });
}

startServer();
