# CareReach — Location-Aware Emergency Doctor-Connect & Follow-Up Appointment Platform

> **Emergency doctor-connect and next-day clinical follow-up platform designed especially for hostel students, college campuses, and people temporarily unable to travel to a clinic or hospital.**

---

## 📌 Problem Statement

Late at night in college dormitories, students frequently experience acute, non-life-threatening medical problems—such as high fevers, sudden gastroenteritis/vomiting from mess food, acute ankle sprains on sports courts, or intense migraines. At odd hours:
1. Campus dispensaries and health centres are often closed or staffed only by minimal first-aid personnel.
2. Students lack private transport or feel too weak or disoriented to walk or navigate unfamiliar city hospitals alone.
3. Panic sets in, leading to self-medication with inappropriate drugs or dangerous delays in recognizing conditions that actually require immediate emergency care.

---

## 💡 The Solution

**CareReach** bridges the critical gap between late-night symptom onset and morning clinic hours:
- **Triage & Safety Screening**: Evaluates symptom severity and immediately screens for life-threatening red flags (crushing chest pain, severe breathing difficulty, loss of consciousness, stroke signs).
- **Proximity Doctor Matching**: Uses a transparent ranking algorithm (`Availability 40% + Proximity 30% + Specialization 15% + Response Time 15%`) to match the student with on-duty, verified doctors within a 3–5 km campus radius.
- **Secure Tele-Triage & Guidance**: Matched physician reviews minimum student hostel details and communicates via secure encrypted chat and simulated video triage. The doctor issues verified, structured **Care Guidance** (immediate actions, hostel self-care protocols, hydration guidelines, and warning signs to monitor).
- **Next-Day Follow-Up Booking**: If physical palpation, stethoscope auscultation, or tests are needed, the platform allows 1-tap booking for confirmed next-day morning slots at the Campus Health Centre or partner clinics.

---

## 👥 Target Users & Personas

| Role | Persona | Key Responsibilities |
|---|---|---|
| **Student** | Arjun Sharma (Kaveri Hostel Block 4B, Room 204) | Requests urgent triage, shares symptoms & minimal location, attends tele-triage, follows care guidance, books follow-up appointments. |
| **Doctor** | Dr. Priya Venkatesh, MD (Internal Medicine & Urgent Care) | Sets live availability, receives incoming emergency alerts, conducts triage, issues verified care guidance, recommends next-day follow-ups. |
| **Admin** | Campus Medical Director (Health Administration) | Verifies physician licenses against medical councils, monitors triage response KPIs, investigates emergency SOS escalations, audits compliance logs. |

---

## 🚀 Key Features

1. **6-Step Guided Doctor Request Flow**:
   - Step 1: Symptom chips (Fever, Vomiting, Headache, Sprain, etc.) + free-text description + Gemini AI Assistant.
   - Step 2: Onset timeline selection.
   - Step 3: Visual discomfort scale (1–10).
   - Step 4: Hostel location detection with privacy room minimization.
   - Step 5: Optional medical record/prescription/photo uploads.
   - Step 6: Mandatory clinical emergency red-flag screening.
2. **Interactive Campus Provider Radar & Map**:
   - Vector radar map displaying student hostel location pin, 1km/2km/3km radius rings, and live pulsing doctor pins (`🟢 Available`, `🟡 In Consult`, `⚪ Offline`).
3. **Emergency Red-Flag Escalation Protocol**:
   - Prominently directs critical emergencies toward National Ambulance (108 / 112) and campus chief wardens rather than delaying care in an online chat.
4. **CareReach Health Assistant & Universal Symptom Checker (Powered by Gemini 3.8 Flash)**:
   - **Universal Voice Dictation (Speech-to-Text)**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) enables users to speak their symptoms aloud instead of typing. Automatically detects clinical keywords in English, தமிழ் (Tamil), and हिन्दी (Hindi) to auto-select matching visual symptom cards.
   - **Universal Accessibility for All People**: Designed for both educated and non-educated users with high-contrast pictorial icon buttons, multi-lingual labels, and 5th-grade plain language explanations.
   - **Audio Read-Aloud (Text-to-Speech)**: Integrated Web Speech API (`speechSynthesis`) button so users who cannot read can listen to preliminary guidance and home first-aid measures.
   - **Visual 1-Tap Triage**: 3-step visual selector (Symptoms, Timeline, and Discomfort Smileys).
   - **Preliminary Guidance & Safe Home Care**: Reassuring explanation of what the symptoms usually mean, safe immediate hydration and resting measures, recommended specialist, and a direct 1-tap **"Proceed to Book Doctor Appointment"** bridge.
   - Strictly avoids autonomous diagnoses or prescribing, immediately escalating red flags to 108 trauma response.
5. **Next-Day Follow-Up Appointment Engine**:
   - Automated post-consultation scheduling system with real-time available slots for Campus Health Centre, City Urgent Care, and Apollo Diagnostics.
6. **Encrypted Health Records Vault & Symptom History Tracking**:
   - **Automated Health Assistant Archival**: Outputs from the Gemini Symptom Checker (evaluated symptoms, severity, duration, preliminary guidance, voice remarks, and recommended specialist) are automatically saved into the student's medical records vault.
   - **Health History & Symptom Progression Timeline**: A dedicated chronological timeline view allowing students (and consulting physicians) to review past health episodes over time, track recurring ailments, and assess illness patterns.
   - **Document Privacy Controls**: Granular per-entry toggle (`Shared with Doctors` vs `Private / Hidden`) ensuring student data confidentiality.
   - **Multi-Category Vault**: Organizes prescriptions, laboratory screens, consultation notes, discharge summaries, and AI symptom assessments.
7. **Multi-Tab Live Synchronization**:
   - Built-in multi-tab sync using `BroadcastChannel` and storage events for real-time interaction between student and doctor windows.
8. **Progressive Web App (PWA)**:
   - Installable on mobile home screens with offline caching service worker and mobile thumb-friendly bottom navigation.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons.
- **AI Integration**: `@google/genai` (Google Gen AI SDK with `gemini-3.8-flash`).
- **PWA & Offline**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`), Vector SVG App Icons.
- **Server**: Express.js with Vite middleware (`server.ts`).
- **State & Data Store**: LocalStorage with automatic schema initialization, seed data, and BroadcastChannel multi-tab real-time event bus.

---

## 📂 Project Architecture

```
/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # PWA service worker with cache-first assets
│   └── icons/                     # 192x192 and 512x512 SVG icons
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── HealthAssistantModal.tsx  # Gemini-powered symptom helper
│   │   ├── common/
│   │   │   ├── Navbar.tsx                # Contextual navigation, SOS & alerts
│   │   │   ├── BottomNav.tsx             # Mobile thumb-reach bottom navigation
│   │   │   ├── DemoBanner.tsx            # Multi-persona instant switcher
│   │   │   └── EmergencyBanner.tsx       # Safety escalation ribbon & modal
│   │   ├── consultation/
│   │   │   ├── CareGuidanceCard.tsx      # Verified doctor guidance card
│   │   │   ├── GuidanceFormModal.tsx     # Doctor guidance authoring tool
│   │   │   └── VideoCallModal.tsx        # Simulated WebRTC tele-triage call
│   │   └── map/
│   │       └── InteractiveVectorMap.tsx  # Vector radar map with doctor pins
│   ├── pages/
│   │   ├── admin/                        # Dashboard, Verifications, Audit Logs, Stream
│   │   ├── doctor/                       # Dashboard, Requests, Appointments, Profile
│   │   ├── public/                       # Landing, HowItWorks, Safety, Login, Register
│   │   └── student/                      # Dashboard, Request Wizard, Records, Clinics, etc.
│   ├── services/
│   │   ├── fcm.ts                        # Firebase Cloud Messaging push notification client & audio alert
│   │   ├── firebase.ts                   # Cloud Firestore live database client & sync
│   │   ├── gemini.ts                     # Gemini 3.8 Flash SDK client & safety instructions
│   │   ├── matching.ts                   # Doctor ranking formula & Haversine distance
│   │   └── store.ts                      # LocalStorage persistence, seed data & event bus
│   ├── types/
│   │   └── index.ts                      # Core TypeScript definitions
│   ├── App.tsx                           # Main router & modal orchestration
│   ├── index.css                         # Tailwind CSS imports & theme styling
│   └── main.tsx                          # App mount & service worker registration
├── public/
│   ├── firebase-messaging-sw.js          # FCM service worker for background push notifications
│   ├── manifest.json                     # PWA web manifest
│   └── sw.js                             # Offline asset cache service worker
├── server.ts                             # Express full-stack REST API server
├── firebase-applet-config.json           # Live Firebase Cloud configuration
├── firebase-blueprint.json               # Intermediate Representation schema
├── firestore.rules                       # Deployed security & access rules
├── metadata.json                         # App capabilities & metadata
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database & REST API Architecture

CareReach integrates a dual-layer data architecture:
1. **Cloud Database (Firebase Firestore)**:
   - Configured via `firebase-applet-config.json` with deployed `firestore.rules`.
   - Collections: `students`, `doctors`, `emergencyRequests`, `consultations`, `consultations/{id}/messages`, `appointments`, `medicalRecords`, `auditLogs`.
   - Real-time client synchronization via `src/services/firebase.ts`.

2. **Full-Stack REST API Gateway (`server.ts`)**:
   - `POST /api/auth/login`: Authenticate as Student, Doctor, or Campus Admin.
   - `GET /api/health`: Telemetry and clinical safety screening monitor.
   - `GET /api/triage/emergency-criteria`: Clinical red-flag triggers & emergency hotlines.
   - `GET /api/doctors/nearby`: Ranked list of verified physicians in vicinity.
   - `POST /api/requests`: Submit an emergency request.
   - `PATCH /api/requests/:id/accept`: Doctor accepts request, triggers FCM push notification, and opens consultation.
   - `POST /api/notifications/fcm-match`: Firebase Cloud Messaging push dispatch gateway.
   - `GET /api/consultations/:id`: Retrieve active consultation details.
   - `POST /api/consultations/:id/messages`: Post encrypted consultation message.
   - `POST /api/consultations/:id/guidance`: Issue official clinical care guidance.
   - `GET /api/appointments` & `POST /api/appointments`: Next-day clinic slot booking.
   - `GET /api/records` & `POST /api/records`: Encrypted medical document vault.
   - `GET /api/admin/analytics`: Real-time system response KPIs and escalation stats.

3. **Firebase Cloud Messaging (FCM) Push Architecture**:
   - Background service worker: `public/firebase-messaging-sw.js` with notification click navigation.
   - Foreground notification handler: Real-time listener (`onMessage`) with Web Audio API chime.
   - In-app push toast: `src/components/common/PushNotificationToast.tsx` with instant 1-tap "Enter Consultation" navigation.
   - Token registration in Firestore: `/students/{studentId}/fcmTokens/{tokenId}`.

4. **Offline Emergency Resilience & Service Worker Caching (`public/sw.js`)**:
   - **Precaching**: Core application routes (`/`, `/student/dashboard`, `/student/emergency-contacts`, `/student/clinics`, `/safety`, `/how-it-works`) and offline medical emergency snapshot (`/offline-emergency-data.json`).
   - **Network-First with Cache Fallback for Medical APIs**: When network fails or during campus Wi-Fi outages, `/api/facilities` and `/api/triage/emergency-criteria` seamlessly serve cached facility contacts, walking distances, and 24/7 hotline numbers.
   - **Offline UI Indicator**: `OfflineStatusIndicator.tsx` alerts students when connection drops and directs them to cached emergency dials. Telephony links (`tel:`) function directly through cellular radios without data connection.

---

## 🔒 Security & Privacy by Design

- **Location Minimization**: Exact room numbers are shielded; doctors only see the hostel block perimeter until consultation consent is given.
- **No Autonomous Diagnostic Liability**: The platform enforces clear boundaries—AI never diagnoses or prescribes; care instructions come exclusively from verified physicians.
- **Audit Trails**: Every login, credential approval, record upload, and triage dispatch is logged with ISO timestamps and severity markers.
- **Sensitive Data Isolation**: Health documents feature individual privacy switches allowing students to restrict visibility.

---

## 🧪 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/carereach.git
   cd carereach
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` (if testing live AI interactions; a clinical rule fallback is active if omitted).

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎭 Demo Credentials & Persona Quick Switcher

The application includes an in-app **DEMO TESTBENCH** banner at the top of every page allowing instant switching:
- **Student Persona**: Arjun Sharma (Hostel Block 4B, Room 204) — Test symptom entry and triage request.
- **Doctor Persona**: Dr. Priya Venkatesh, MD (Internal Medicine) — Receive live alerts, accept requests, and issue care guidance.
- **Admin Persona**: Campus Medical Director — Review pending physician licenses and audit logs.

---

## ⚠️ Safety Disclaimer

> **CareReach is an urgent health communication and tele-triage support platform.** It does not replace national emergency services (108 / 112 / 911), emergency hospital trauma centres, or direct clinical examination. If experiencing severe chest pain, acute breathing difficulty, uncontrolled bleeding, or signs of stroke, users are directed to seek emergency hospital care immediately.
