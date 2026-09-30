import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Building2,
  Clock,
  Award
} from 'lucide-react';
import { VerificationStatus } from '../../types';

interface Props {
  state: AppState;
}

export const DoctorVerificationPage: React.FC<Props> = ({ state }) => {
  const [filter, setFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [search, setSearch] = useState('');

  const doctors = state.doctors.filter((d) => {
    const matchesFilter = filter === 'ALL' || d.verificationStatus === filter;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleVerify = (id: string) => {
    CareReachStore.verifyDoctor(id, 'VERIFIED');
  };

  const handleReject = (id: string) => {
    CareReachStore.verifyDoctor(id, 'REJECTED');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Provider Credentialing
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Physician Medical License Verifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review medical council registrations, state medical board IDs, and hospital affiliations before granting tele-triage access.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Table / Cards */}
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{doc.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.verificationStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold">{doc.specialization}</p>
                  <p className="text-xs text-slate-500">{doc.qualification}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      Registration: {doc.licenseNumber}
                    </span>
                    <span>Affiliation: {doc.clinicAffiliation}</span>
                    <span>Experience: {doc.experienceYears} yrs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {doc.verificationStatus === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(doc.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Verify License
                    </button>
                  </>
                ) : doc.verificationStatus === 'VERIFIED' ? (
                  <button
                    onClick={() => handleReject(doc.id)}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
                  >
                    Revoke License
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerify(doc.id)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Re-Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
