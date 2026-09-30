import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  Inbox,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { RequestSeverity } from '../../types';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const DoctorRequestsPage: React.FC<Props> = ({ state, onNavigate }) => {
  const currentDoc =
    state.doctors.find((d) => d.id === state.currentUserId) || state.doctors[0];

  const [severityFilter, setSeverityFilter] = useState<'ALL' | RequestSeverity>('ALL');

  const requests = state.requests.filter(
    (r) =>
      r.status === 'PENDING_MATCH' &&
      (severityFilter === 'ALL' || r.severity === severityFilter)
  );

  const handleAccept = (reqId: string) => {
    const consult = CareReachStore.acceptRequest(reqId, currentDoc.id);
    if (consult) {
      onNavigate(`/student/consultation/${consult.id}`);
    }
  };

  const handleDecline = (reqId: string) => {
    CareReachStore.declineRequest(reqId, currentDoc.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
              Campus Urgent Intake
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Incoming Student Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live broadcast queue of non-critical health requests from students in dormitories.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Filter Severity:</span>
            {['ALL', 'MILD', 'MODERATE', 'SEVERE'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  severityFilter === sev
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <Inbox className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">Inbox Clear</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                There are currently no unanswered triage requests. When students submit symptoms, they will appear here with an audible alert.
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200 hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">{req.studentName}</span>
                    <span className="text-xs text-slate-500">({req.studentAge} y/o)</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        req.severity === 'CRITICAL' || req.severity === 'SEVERE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.severity}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-teal-900">
                    Concern: {req.symptoms.join(', ')} • Started: {req.startedWhen}
                  </p>

                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{req.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sky-600" /> {req.studentHostel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-sky-600" /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept Request</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
