import React from 'react';
import {
  HeartPulse,
  ShieldAlert,
  MapPin,
  Clock,
  CalendarCheck,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';
import { CareReachStore, AppState } from '../../services/store';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
  onOpenSOSModal: () => void;
}

export const LandingPage: React.FC<Props> = ({
  state,
  onNavigate,
  onOpenAssistant,
  onOpenSOSModal
}) => {
  const verifiedDoctorsCount = state.doctors.filter((d) => d.verificationStatus === 'VERIFIED').length;
  const availableDoctorsCount = state.doctors.filter((d) => d.status === 'AVAILABLE' && d.verificationStatus === 'VERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-10 pb-20 border-b border-slate-200">
        {/* Soft background decor circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -top-40 left-10 w-96 h-96 rounded-full bg-sky-200 blur-3xl" />
          <div className="absolute -top-20 right-10 w-96 h-96 rounded-full bg-teal-200 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Tagline Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Campus & Hostel Medical Response Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mt-6 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Healthcare Help, When You{' '}
              <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                Can't Reach
              </span>{' '}
              the Hospital.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Connect with nearby verified doctors from your hostel room when sudden illness strikes at odd hours. Receive licensed first-aid triage, clear self-care guidance, and seamless next-day clinic appointments.
            </p>
          </div>

          {/* High-Visibility Clinical Warning Banner */}
          <div className="mt-8 max-w-2xl mx-auto bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-left">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong className="font-bold block text-amber-950 mb-0.5">Emergency Triage Protocol:</strong>
              CareReach is designed for non-life-threatening emergencies. If experiencing severe chest pain, breathing difficulty, loss of consciousness, or massive trauma, call emergency services immediately.
            </div>
          </div>

          {/* Primary Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={() => {
                CareReachStore.switchUser('STUDENT');
                onNavigate('/student/request-doctor');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <HeartPulse className="h-5 w-5 animate-pulse" />
              <span>REQUEST A DOCTOR NOW</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                CareReachStore.switchUser('DOCTOR');
                onNavigate('/doctor/dashboard');
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <span>Doctor Portal</span>
            </button>
          </div>

          {/* Real-time stats micro-bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <p className="text-2xl font-black text-slate-900">{availableDoctorsCount}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Doctors Online Now</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-black text-slate-900">&lt; 3 mins</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Avg. Response Time</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-black text-slate-900">{verifiedDoctorsCount} Verified</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Licensed Medical Staff</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-black text-slate-900">Next-Day</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Follow-Up Slots</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Journey */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              How CareReach Works
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Designed for Sick Students in Dormitories
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              No long waits, no unnecessary late-night campus travel for non-critical ailments.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 relative group hover:border-sky-300 hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center text-base shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4">
                Symptom Triage & Safety Check
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Select your symptoms (fever, vomiting, sprain, pain) and severity. Safety algorithms immediately check for red flags requiring an emergency hospital.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 relative group hover:border-teal-300 hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-2xl bg-teal-600 text-white font-black flex items-center justify-center text-base shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4">
                Proximity Doctor Matching
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our transparent matching algorithm ranks nearby verified doctors within a 3-5 km campus perimeter based on distance, status, and specialty.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 relative group hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4">
                Secure Chat & Video Consult
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The doctor reviews your hostel details, opens encrypted chat/video, and provides safe, structured first-aid guidance for tonight.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 relative group hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-md">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4">
                Next-Day Clinic Follow-Up
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                If physical examination is required, book a confirmed appointment slot for the next morning at the Campus Health Centre or nearby clinic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Personas Section */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Evaluation & Demonstration Testbench
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mt-3">
                Experience CareReach from All 3 Perspectives
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Test the end-to-end journey in real time: trigger a request as Student Arjun, accept and issue clinical care guidance as Dr. Priya, and inspect compliance audits as Campus Admin.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Persona Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={state.student.avatarUrl}
                      alt="Student"
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-400"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{state.student.name}</h4>
                      <p className="text-xs text-sky-400">{state.student.hostelName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    20 y/o B.Tech Student feeling sudden high fever and vomiting in Room 204 at 10:30 PM.
                  </p>
                </div>
                <button
                  onClick={() => {
                    CareReachStore.switchUser('STUDENT');
                    onNavigate('/student/dashboard');
                  }}
                  className="mt-4 w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Launch as Student</span>
                </button>
              </div>

              {/* Doctor Persona Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={state.doctors[0].avatarUrl}
                      alt="Doctor"
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-teal-400"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{state.doctors[0].name}</h4>
                      <p className="text-xs text-teal-400">MD • 1.2 km from Campus</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Verified Emergency Physician on-duty. Receives real-time push alerts, conducts triage, issues care guidance.
                  </p>
                </div>
                <button
                  onClick={() => {
                    CareReachStore.switchUser('DOCTOR');
                    onNavigate('/doctor/dashboard');
                  }}
                  className="mt-4 w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="h-4 w-4" />
                  <span>Launch as Doctor</span>
                </button>
              </div>

              {/* Admin Persona Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center ring-2 ring-purple-400">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Campus Health Director</h4>
                      <p className="text-xs text-purple-400">Administrative Oversight</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Verifies physician medical licenses, monitors response KPIs, reviews red-flag escalations and immutable audit trails.
                  </p>
                </div>
                <button
                  onClick={() => {
                    CareReachStore.switchUser('ADMIN');
                    onNavigate('/admin/dashboard');
                  }}
                  className="mt-4 w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Launch as Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Red Flags Warning Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                Safety by Design
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Clear Boundaries Between Tele-Triage & Emergency Care
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                CareReach does NOT replace emergency rooms or autonomous diagnosis. When high-risk red-flag indicators appear, our system does not encourage waiting for a chat message—it immediately directs the student to emergency hospital services.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Privacy-by-Design Location Minimization</strong>
                    Doctors see only hostel block and approximate distance. Room numbers are only revealed with consent during confirmed consultations.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">100% Doctor-Approved Guidance</strong>
                    No synthetic prescriptions or automated medical directives. All care summaries are verified and signed by a licensed practitioner.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Campus Warden & Family SOS Integration</strong>
                    1-tap notification dials student emergency contacts with automated hostel location text during severe crises.
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Comparison Table */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Emergency vs CareReach Triage
              </h3>

              <div className="mt-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800/80">
                  <h5 className="font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="h-4 w-4" /> Go to Emergency Hospital / Dial 108:
                  </h5>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Severe chest pressure, acute shortness of breath, loss of consciousness, uncontrolled bleeding, severe anaphylactic throat swelling, sudden numbness/slurred speech.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/80">
                  <h5 className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Stethoscope className="h-4 w-4" /> Appropriate for CareReach Connect:
                  </h5>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Hostel food poisoning/vomiting, fever and chills, severe ankle sprain or minor sports injury, tension headaches, dehydration, allergy flares, minor burns, next-day follow-up coordination.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Need immediate help?</span>
                <button
                  onClick={onOpenSOSModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow"
                >
                  Dial 108 Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white text-base">CareReach</span>
                <p className="text-[11px] text-slate-500">
                  Emergency Doctor-Connect & Next-Day Clinic Appointments for College Hostels
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <button onClick={() => onNavigate('/safety')} className="hover:text-white transition-colors">
                Safety Charter
              </button>
              <button onClick={() => onNavigate('/how-it-works')} className="hover:text-white transition-colors">
                How It Works
              </button>
              <button onClick={onOpenAssistant} className="hover:text-white transition-colors flex items-center gap-1 text-sky-400">
                <Sparkles className="h-3.5 w-3.5" /> AI Assistant
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 CareReach Health Platform. Fictional Academic Demo Environment.</p>
            <p>
              Disclaimer: CareReach provides health communication and triage support. It does not replace emergency 108 services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
