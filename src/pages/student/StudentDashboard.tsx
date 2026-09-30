import React from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  Calendar,
  FileText,
  MapPin,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Building2,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
  onOpenSOSModal: () => void;
}

export const StudentDashboard: React.FC<Props> = ({
  state,
  onNavigate,
  onOpenAssistant,
  onOpenSOSModal
}) => {
  const student = state.student;

  // Active consultation if any
  const activeConsultation = state.consultations.find(
    (c) => c.studentId === student.id && c.status === 'ACTIVE'
  );

  // Latest completed consultation with guidance
  const latestConsultation = state.consultations.find(
    (c) => c.studentId === student.id && c.guidance
  );

  // Next upcoming confirmed appointment
  const upcomingAppointment = state.appointments.find(
    (a) => a.studentId === student.id && a.status === 'CONFIRMED'
  );

  // Calculate current greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Greeting & Hostel Location Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Student Patient Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {greeting}, {student.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-sky-600" />
              <span>{student.hostelName}, {student.hostelRoom} • {student.college}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-800 text-xs font-bold hover:shadow-sm transition-all"
            >
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span>AI Health Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('/student/profile')}
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
              title="Medical Profile"
            >
              Profile
            </button>
          </div>
        </div>

        {/* ACTIVE CONSULTATION ALERT BANNER (If In Progress) */}
        {activeConsultation && (
          <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-teal-700 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <span className="h-3 w-3 rounded-full bg-emerald-300 animate-ping" />
              <div>
                <h3 className="font-extrabold text-base">
                  Active Consultation in Progress with {activeConsultation.doctorName}
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  {activeConsultation.doctorSpecialty} • Secure chat & triage active
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(`/student/consultation/${activeConsultation.id}`)}
              className="px-5 py-2.5 bg-white text-teal-800 font-extrabold text-xs rounded-xl shadow-md hover:bg-teal-50 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Resume Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* HERO CARD: "NEED MEDICAL HELP?" */}
        <div className="bg-gradient-to-r from-rose-50 via-white to-red-50/60 rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Immediate Tele-Triage</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Feeling Sick in Your Hostel Room?
            </h2>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Sudden fever, vomiting, acute sprain, or severe headache? Request a nearby verified doctor to evaluate symptoms, provide safe self-care guidance for tonight, and book next-day clinic visits.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/student/request-doctor')}
                className="px-7 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <HeartPulse className="h-5 w-5 animate-pulse" />
                <span>REQUEST A DOCTOR</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('/student/doctors')}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 shadow-sm transition-all"
              >
                Browse Nearby Doctors
              </button>
            </div>
          </div>
        </div>

        {/* 4 Secondary Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('/student/clinics')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Nearby Facilities</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Campus clinic, 24/7 ER & MedPlus</p>
          </button>

          <button
            onClick={() => onNavigate('/student/appointments')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">My Appointments</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {upcomingAppointment ? '1 Confirmed Visit' : 'Next-day follow-ups'}
            </p>
          </button>

          <button
            onClick={() => onNavigate('/student/records')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Health Records Vault</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {state.records.length} documents uploaded
            </p>
          </button>

          <button
            onClick={() => onNavigate('/student/emergency-contacts')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Emergency Contacts</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Warden & Parent dials</p>
          </button>
        </div>

        {/* 2-Column Section: Upcoming Appointment & Latest Care Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Next-Day Appointment Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Next Scheduled Visit</h3>
                </div>
                <button
                  onClick={() => onNavigate('/student/appointments')}
                  className="text-xs text-sky-600 hover:underline font-semibold"
                >
                  View all
                </button>
              </div>

              {upcomingAppointment ? (
                <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900">{upcomingAppointment.facilityName}</span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                      CONFIRMED
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    With {upcomingAppointment.doctorName} ({upcomingAppointment.doctorSpecialty})
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-600 font-medium pt-1">
                    <span>📅 {upcomingAppointment.date}</span>
                    <span>⏰ {upcomingAppointment.time}</span>
                    <span>📍 {upcomingAppointment.facilityAddress.split(',')[0]}</span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1 italic">
                    Reason: {upcomingAppointment.reason}
                  </p>
                </div>
              ) : (
                <div className="mt-6 py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                  No upcoming appointments. If you consult a doctor, follow-up clinic visits will appear here.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Appointment status synced</span>
              <button
                onClick={() => onNavigate('/student/request-doctor')}
                className="text-sky-600 font-bold hover:underline"
              >
                Book a consultation →
              </button>
            </div>
          </div>

          {/* Recent Consultation & Care Guidance */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Doctor Care Guidance</h3>
                </div>
                {latestConsultation && (
                  <button
                    onClick={() => onNavigate(`/student/consultation/${latestConsultation.id}`)}
                    className="text-xs text-teal-600 hover:underline font-semibold"
                  >
                    Open summary
                  </button>
                )}
              </div>

              {latestConsultation && latestConsultation.guidance ? (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {latestConsultation.doctorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(latestConsultation.guidance.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
                    "{latestConsultation.guidance.immediateGuidance}"
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                      ✓ First-Aid Issued
                    </span>
                    {latestConsultation.guidance.followUpRecommended && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded">
                        Follow-up Advised
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                  No previous consultation notes. Your care instructions will appear here permanently.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Saved in your Health Records</span>
              <button
                onClick={() => onNavigate('/student/records')}
                className="text-teal-600 font-bold hover:underline"
              >
                View all records →
              </button>
            </div>
          </div>
        </div>

        {/* Emergency SOS Quick Contact Strip */}
        <div className="bg-red-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <PhoneCall className="h-6 w-6 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-base">In-Person Emergency Support</h4>
              <p className="text-xs text-red-100">
                Warden: Prof. Murugan (+91 94432 10987) • National Ambulance: 108 / 112
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSOSModal}
            className="px-6 py-3 bg-white text-red-700 font-extrabold text-xs rounded-xl shadow-lg hover:bg-red-50 active:scale-95 transition-all"
          >
            Launch Emergency SOS
          </button>
        </div>
      </div>
    </div>
  );
};
