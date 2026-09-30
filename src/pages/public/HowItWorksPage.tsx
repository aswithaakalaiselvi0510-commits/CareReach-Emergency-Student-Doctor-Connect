import React from 'react';
import {
  HeartPulse,
  Radar,
  MessageSquare,
  Calendar,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            System Architecture & Flow
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How CareReach Works
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            From sudden hostel room illness to verified doctor consultation and next-day clinical follow-up in 4 simple stages.
          </p>
        </div>

        {/* 4 Steps Detailed */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/30">
              1
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Symptom Submission & Safety Screening
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When a student feels unwell, they open CareReach and select their symptoms, duration, and visual pain severity (1-10). The platform immediately executes an automated safety screening checklist to ensure the student does not have critical red flags (severe chest pain, loss of consciousness, stroke signs). If red flags are detected, the system immediately presents direct emergency ambulance 108 dials.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-teal-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/30">
              2
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Transparent Provider Matching Algorithm
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our ranking engine computes: <br />
                <code className="bg-slate-100 px-2 py-0.5 rounded text-sky-800 font-mono text-xs">
                  Score = Availability (40%) + Proximity (30%) + Specialization (15%) + Response Time (15%)
                </code>
                <br />
                The request is dispatched to verified doctors within a 3-5 km campus perimeter. Doctors receive an audible chime alert with a 60-second response window and can accept or decline with 1 tap.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              3
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Encrypted Tele-Triage & Care Guidance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The doctor reviews the student's allergy baseline and opens secure real-time messaging (with simulated WebRTC video). After assessing the student, the doctor issues an official Care Guidance summary specifying immediate actions, hostel self-care protocols, and warning signs to watch for tonight.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
              4
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900">
                Next-Day Clinic Follow-Up Scheduling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If the doctor advises a physical palpation, stethoscope check, or diagnostic test, available next-day appointment slots appear right inside the consultation workspace. The student books their slot with one tap, receiving a confirmed digital pass for the Campus Health Centre or partner clinic.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/student/request-doctor')}
            className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <HeartPulse className="h-4 w-4" />
            <span>Try CareReach Guided Triage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
