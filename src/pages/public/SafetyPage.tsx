import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  Lock,
  Building2,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
  onOpenSOSModal: () => void;
}

export const SafetyPage: React.FC<Props> = ({ onNavigate, onOpenSOSModal }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            CareReach Clinical Safety Charter
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Safety & Emergency Boundaries First
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            CareReach provides location-aware tele-triage communication and follow-up appointment coordination. It does not replace emergency 108 ambulance response or in-hospital acute trauma care.
          </p>
        </div>

        {/* Prominent Red-Flag Alert Card */}
        <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <AlertTriangle className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Red-Flag Warning Symptoms
              </h2>
              <p className="text-xs sm:text-sm text-red-100">
                If you or a fellow hostel student experience any of the following, call 108 immediately:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2">
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Severe crushing chest pain, pressure, or radiant arm numbness</span>
            </div>
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Acute shortness of breath, gasping, or inability to speak full sentences</span>
            </div>
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Loss of consciousness, severe head trauma, or unresponsiveness</span>
            </div>
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Uncontrolled bleeding, compound bone fractures, or deep wounds</span>
            </div>
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Facial drooping, one-sided weakness, or sudden slurred speech</span>
            </div>
            <div className="p-3 rounded-xl bg-red-700/60 border border-red-500/50 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Severe anaphylaxis, facial swelling, or throat constriction</span>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={onOpenSOSModal}
              className="px-6 py-3 bg-white text-red-700 font-extrabold text-xs rounded-xl shadow-lg hover:bg-red-50 active:scale-95 transition-all"
            >
              Dial National Emergency (108 / 112)
            </button>
          </div>
        </div>

        {/* 4 Pillars of Clinical Safety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              1. No Autonomous Diagnostic AI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CareReach never generates synthetic diagnoses or autonomous drug prescriptions. Artificial intelligence is solely utilized as a communication helper to assist students in organizing symptom descriptions before speaking with human doctors.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              2. 100% Verified Physician Licensing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every medical doctor on CareReach undergoes manual verification of their medical council registration (MCI/NMC or State Medical Council) before being permitted to accept student requests.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              3. Privacy-by-Design Location Minimization
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student room numbers are never broadcast to all doctors. Only the assigned, accepted physician gains access to minimum hostel location data required to guide safe campus health response.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              4. Next-Day In-Person Continuity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tele-triage is designed as a bridge through the night. The workflow seamlessly coordinates follow-up clinic visits for physical examination, palpation, and lab tests the next morning.
            </p>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow hover:bg-slate-800"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
