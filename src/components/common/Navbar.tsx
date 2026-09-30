import React, { useState, useEffect } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  HeartPulse,
  Bell,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Calendar,
  FileText,
  User,
  Shield,
  Stethoscope,
  Activity,
  Download,
  AlertCircle
} from 'lucide-react';

interface Props {
  state: AppState;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
  onOpenSOSModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  state,
  currentPath,
  onNavigate,
  onOpenAssistant,
  onOpenSOSModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const user = CareReachStore.getCurrentUser();
  const unreadNotifications = state.notifications.filter(
    (n) => (n.userId === user.id || (user.role === 'ADMIN' && n.userId === 'admin-1')) && !n.read
  );

  const pendingRequestsCount = state.requests.filter(
    (r) => r.status === 'PENDING_MATCH' && !r.isEmergencyFlagged
  ).length;

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  CareReach
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                    Hostel & Campus
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Emergency Doctor Connect
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {state.currentRole === 'STUDENT' && (
              <>
                <button
                  onClick={() => onNavigate('/student/dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/student/dashboard')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('/student/request-doctor')}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    currentPath.includes('/student/request-doctor')
                      ? 'bg-red-50 text-red-700'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Request a Doctor
                </button>
                <button
                  onClick={() => onNavigate('/student/doctors')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/student/doctors')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Nearby Doctors
                </button>
                <button
                  onClick={() => onNavigate('/student/appointments')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/student/appointments')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => onNavigate('/student/records')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/student/records')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Health Records
                </button>
              </>
            )}

            {state.currentRole === 'DOCTOR' && (
              <>
                <button
                  onClick={() => onNavigate('/doctor/dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/doctor/dashboard')
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Doctor Hub
                </button>
                <button
                  onClick={() => onNavigate('/doctor/requests')}
                  className={`px-3 py-1.5 rounded-lg transition-colors relative ${
                    currentPath.includes('/doctor/requests')
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Incoming Requests
                  {pendingRequestsCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('/doctor/appointments')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/doctor/appointments')
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Follow-ups
                </button>
              </>
            )}

            {state.currentRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('/admin/dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/admin/dashboard')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Admin Overview
                </button>
                <button
                  onClick={() => onNavigate('/admin/doctors')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/admin/doctors')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Doctor Approvals
                </button>
                <button
                  onClick={() => onNavigate('/admin/requests')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/admin/requests')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Live Requests
                </button>
                <button
                  onClick={() => onNavigate('/admin/audit-logs')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentPath.includes('/admin/audit-logs')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Audit Logs
                </button>
              </>
            )}
          </div>

          {/* Action Tools: AI Assistant, Notifications, Profile, SOS */}
          <div className="flex items-center gap-2">
            {/* AI Health Assistant button */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-800 font-semibold text-xs hover:border-sky-300 hover:shadow-sm transition-all"
              title="Open CareReach AI Health Assistant"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span className="hidden sm:inline">AI Health Assistant</span>
            </button>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install PWA</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-sky-600" />
                      <span className="font-bold text-xs text-slate-800">Notifications</span>
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={() => CareReachStore.markAllNotificationsRead(user.id)}
                        className="text-[11px] text-sky-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {state.notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      state.notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            CareReachStore.markNotificationRead(n.id);
                            if (n.linkUrl) {
                              onNavigate(n.linkUrl);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-sky-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency SOS Button in Navbar */}
            <button
              onClick={onOpenSOSModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>SOS</span>
            </button>

            {/* User Profile Avatar / Role Tag */}
            <button
              onClick={() => {
                if (state.currentRole === 'STUDENT') onNavigate('/student/profile');
                else if (state.currentRole === 'DOCTOR') onNavigate('/doctor/profile');
                else onNavigate('/admin/dashboard');
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors ml-1"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
              />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {state.currentRole === 'STUDENT' && (
            <>
              <button
                onClick={() => { onNavigate('/student/dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => { onNavigate('/student/request-doctor'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50"
              >
                🚨 Request a Doctor
              </button>
              <button
                onClick={() => { onNavigate('/student/doctors'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Nearby Doctors
              </button>
              <button
                onClick={() => { onNavigate('/student/appointments'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Appointments
              </button>
              <button
                onClick={() => { onNavigate('/student/records'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Health Records Vault
              </button>
              <button
                onClick={() => { onNavigate('/student/profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Hostel & Medical Profile
              </button>
            </>
          )}

          {state.currentRole === 'DOCTOR' && (
            <>
              <button
                onClick={() => { onNavigate('/doctor/dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-teal-800 hover:bg-teal-50"
              >
                Doctor Hub
              </button>
              <button
                onClick={() => { onNavigate('/doctor/requests'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-teal-800 hover:bg-teal-50"
              >
                Incoming Emergency Requests ({pendingRequestsCount})
              </button>
              <button
                onClick={() => { onNavigate('/doctor/appointments'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-teal-800 hover:bg-teal-50"
              >
                Scheduled Follow-up Appointments
              </button>
              <button
                onClick={() => { onNavigate('/doctor/profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-teal-800 hover:bg-teal-50"
              >
                Doctor Credentials & Availability
              </button>
            </>
          )}

          {state.currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => { onNavigate('/admin/dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-800 hover:bg-purple-50"
              >
                Admin Overview
              </button>
              <button
                onClick={() => { onNavigate('/admin/doctors'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-800 hover:bg-purple-50"
              >
                Doctor Verification Queue
              </button>
              <button
                onClick={() => { onNavigate('/admin/requests'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-800 hover:bg-purple-50"
              >
                Live Requests & Emergency Escalations
              </button>
              <button
                onClick={() => { onNavigate('/admin/audit-logs'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-800 hover:bg-purple-50"
              >
                Audit Trails
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
