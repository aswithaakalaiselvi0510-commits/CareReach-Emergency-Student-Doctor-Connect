import React, { useState, useEffect } from 'react';
import { CareReachStore, AppState } from './services/store';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { DemoBanner } from './components/common/DemoBanner';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { OfflineStatusIndicator } from './components/common/OfflineStatusIndicator';
import { HealthAssistantModal } from './components/ai/HealthAssistantModal';
import { PushNotificationToast } from './components/common/PushNotificationToast';
import { initializeFCM } from './services/fcm';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { SafetyPage } from './pages/public/SafetyPage';
import { LoginPage } from './pages/public/LoginPage';
import { DoctorRegisterPage } from './pages/public/DoctorRegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { RequestDoctorWizard } from './pages/student/RequestDoctorWizard';
import { StudentConsultationPage } from './pages/student/StudentConsultationPage';
import { AppointmentsPage } from './pages/student/AppointmentsPage';
import { HealthRecordsPage } from './pages/student/HealthRecordsPage';
import { NearbyDoctorsPage } from './pages/student/NearbyDoctorsPage';
import { EmergencyContactsPage } from './pages/student/EmergencyContactsPage';
import { NearbyClinicsPage } from './pages/student/NearbyClinicsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorRequestsPage } from './pages/doctor/DoctorRequestsPage';
import { DoctorAppointmentsPage } from './pages/doctor/DoctorAppointmentsPage';
import { DoctorProfilePage } from './pages/doctor/DoctorProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorVerificationPage } from './pages/admin/DoctorVerificationPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { LiveRequestsPage } from './pages/admin/LiveRequestsPage';

export default function App() {
  const [state, setState] = useState<AppState>(CareReachStore.getState());
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = CareReachStore.subscribe((newState) => {
      setState({ ...newState });
    });
    // Initialize Firebase Cloud Messaging client
    initializeFCM(CareReachStore.getState().student.id);
    return unsubscribe;
  }, []);

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route extraction
  const renderRoute = () => {
    // Consultation routes
    if (currentPath.startsWith('/student/consultation/')) {
      const id = currentPath.split('/student/consultation/')[1];
      return (
        <StudentConsultationPage
          consultationId={id}
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      );
    }
    if (currentPath.startsWith('/doctor/consultation/')) {
      const id = currentPath.split('/doctor/consultation/')[1];
      return (
        <StudentConsultationPage
          consultationId={id}
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      );
    }

    // Public Routes
    if (currentPath === '/' || currentPath === '') {
      return (
        <LandingPage
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenSOSModal={() => setIsSOSModalOpen(true)}
        />
      );
    }
    if (currentPath === '/how-it-works') {
      return <HowItWorksPage onNavigate={navigate} />;
    }
    if (currentPath === '/safety') {
      return (
        <SafetyPage
          onNavigate={navigate}
          onOpenSOSModal={() => setIsSOSModalOpen(true)}
        />
      );
    }
    if (currentPath === '/login') {
      return <LoginPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/doctor-register') {
      return <DoctorRegisterPage onNavigate={navigate} />;
    }

    // Student Routes
    if (currentPath === '/student/dashboard') {
      return (
        <StudentDashboard
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenSOSModal={() => setIsSOSModalOpen(true)}
        />
      );
    }
    if (currentPath === '/student/request-doctor') {
      return (
        <RequestDoctorWizard
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenSOSModal={() => setIsSOSModalOpen(true)}
        />
      );
    }
    if (currentPath === '/student/doctors') {
      return <NearbyDoctorsPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/student/appointments') {
      return (
        <AppointmentsPage
          state={state}
          onNavigate={navigate}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      );
    }
    if (currentPath === '/student/records') {
      return <HealthRecordsPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/student/emergency-contacts') {
      return (
        <EmergencyContactsPage
          state={state}
          onOpenSOSModal={() => setIsSOSModalOpen(true)}
        />
      );
    }
    if (currentPath === '/student/clinics') {
      return <NearbyClinicsPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/student/profile') {
      return <StudentProfilePage state={state} />;
    }

    // Doctor Routes
    if (currentPath === '/doctor/dashboard') {
      return <DoctorDashboard state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/doctor/requests') {
      return <DoctorRequestsPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/doctor/appointments') {
      return <DoctorAppointmentsPage state={state} />;
    }
    if (currentPath === '/doctor/profile') {
      return <DoctorProfilePage state={state} />;
    }

    // Admin Routes
    if (currentPath === '/admin/dashboard') {
      return <AdminDashboard state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/admin/doctors') {
      return <DoctorVerificationPage state={state} />;
    }
    if (currentPath === '/admin/requests') {
      return <LiveRequestsPage state={state} onNavigate={navigate} />;
    }
    if (currentPath === '/admin/audit-logs') {
      return <AuditLogsPage state={state} />;
    }

    // Fallback to Landing
    return (
      <LandingPage
        state={state}
        onNavigate={navigate}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
      />
    );
  };

  const pendingRequestsCount = state.requests.filter(
    (r) => r.status === 'PENDING_MATCH' && !r.isEmergencyFlagged
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16 md:pb-0">
      {/* 1. Mandatory Clinical Safety Emergency Warning Ribbon */}
      <EmergencyBanner onOpenSOSModal={() => setIsSOSModalOpen(true)} />

      {/* 1.1 Offline Network Resilience Banner */}
      <OfflineStatusIndicator onNavigate={navigate} />

      {/* 2. Interactive Role Switcher Testbench Banner */}
      <DemoBanner state={state} onNavigate={navigate} />

      {/* 3. Main Navigation Bar */}
      <Navbar
        state={state}
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
      />

      {/* 4. Active Page Content */}
      <main className="flex-1">{renderRoute()}</main>

      {/* 5. Mobile-First Bottom Nav (Thumb-zone access) */}
      <BottomNav
        currentRole={state.currentRole}
        currentPath={currentPath}
        onNavigate={navigate}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* 5.1 Real-Time Firebase Cloud Messaging Push Toast */}
      <PushNotificationToast onNavigate={navigate} />

      {/* 6. Gemini 3.8 Health Assistant & Symptom Checker Modal */}
      <HealthAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigate={navigate}
      />

      {/* 7. Global Emergency SOS Modal */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-300 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
                  SOS
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">National Emergency Support</h3>
                  <p className="text-xs text-red-600 font-semibold">Immediate Dispatch & Paramedics</p>
                </div>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              If experiencing loss of consciousness, uncontrolled bleeding, acute chest pain, or anaphylaxis:
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:108"
                className="flex items-center justify-between p-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all"
              >
                <div className="text-left">
                  <span className="block text-sm">Call National Ambulance (108 / 112)</span>
                  <span className="text-[11px] text-red-100 font-normal">Toll-free emergency trauma dispatch</span>
                </div>
                <span className="px-3 py-1 bg-white text-red-700 rounded-lg text-xs font-black">DIAL 108</span>
              </a>

              <a
                href="tel:+919443210987"
                className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-sm transition-all"
              >
                <div className="text-left">
                  <span className="block text-xs">Call Hostel Chief Warden (Prof. Murugan)</span>
                  <span className="text-[10px] text-slate-400 font-normal">For gate access and campus transport</span>
                </div>
                <span className="px-3 py-1 bg-slate-800 text-white rounded-lg text-[11px]">DIAL WARDEN</span>
              </a>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Return to CareReach
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
