import React, { useState } from 'react';
import { AppState } from '../../services/store';
import {
  Inbox,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Search,
  Filter
} from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const LiveRequestsPage: React.FC<Props> = ({ state, onNavigate }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const requests = state.requests.filter((r) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return r.status === 'PENDING_MATCH';
    if (filter === 'ACCEPTED') return r.status === 'ACCEPTED';
    if (filter === 'EMERGENCY') return r.isEmergencyFlagged;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Campus Health Telemetry
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Live Medical Requests & Triage Stream
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time monitoring of hostel requests, dispatch latencies, and emergency ambulance escalations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            {['ALL', 'PENDING', 'ACCEPTED', 'EMERGENCY'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
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

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-sm">
              <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <span>No requests currently match this filter.</span>
            </div>
          ) : (
            requests.map((r) => (
              <div
                key={r.id}
                className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  r.isEmergencyFlagged
                    ? 'border-red-400 bg-red-50/30'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">{r.studentName}</span>
                    <span className="text-xs text-slate-500">({r.studentAge} y/o)</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        r.isEmergencyFlagged
                          ? 'bg-red-600 text-white'
                          : r.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isEmergencyFlagged ? '🚨 EMERGENCY SOS' : r.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    Symptoms: {r.symptoms.join(', ')} • Severity: {r.severity}
                  </p>

                  <p className="text-xs text-slate-600 italic">"{r.description}"</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-sky-600" /> {r.studentHostel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-sky-600" /> Dispatched: {new Date(r.createdAt).toLocaleTimeString()}
                    </span>
                    {r.assignedDoctorName && (
                      <span className="text-teal-700 font-bold">
                        Assigned: {r.assignedDoctorName}
                      </span>
                    )}
                  </div>
                </div>

                {r.consultationId && (
                  <button
                    onClick={() => onNavigate(`/student/consultation/${r.consultationId}`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 shadow"
                  >
                    View Consultation
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
