import React from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  Stethoscope,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Languages,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  state: AppState;
}

export const DoctorProfilePage: React.FC<Props> = ({ state }) => {
  const doctor =
    state.doctors.find((d) => d.id === state.currentUserId) || state.doctors[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="h-20 w-20 rounded-3xl object-cover ring-4 ring-teal-500/30"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{doctor.name}</h1>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      doctor.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> {doctor.verificationStatus}
                  </span>
                </div>
                <p className="text-sm font-semibold text-teal-800 mt-1">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  License: {doctor.licenseNumber}
                </p>
              </div>
            </div>

            {doctor.isDemo && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-auto">
                Verified Clinical Demo Account
              </span>
            )}
          </div>

          {/* Credentials Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Medical Qualification
              </span>
              <p className="font-bold text-sm text-slate-900">{doctor.qualification}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Experience & Track Record
              </span>
              <p className="font-bold text-sm text-slate-900">
                {doctor.experienceYears} Years Clinical Practice (Rating: ⭐ {doctor.rating})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Clinic Affiliation
              </span>
              <p className="font-bold text-sm text-slate-900">{doctor.clinicAffiliation}</p>
              <p className="text-slate-500">{doctor.clinicAddress}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Languages Supported
              </span>
              <p className="font-bold text-sm text-slate-900">{doctor.languages.join(', ')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Consultation Hours
              </span>
              <p className="font-bold text-sm text-slate-900">{doctor.consultationHours}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Tele-Triage Channels
              </span>
              <p className="font-bold text-sm text-slate-900">
                {doctor.consultationTypes.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
